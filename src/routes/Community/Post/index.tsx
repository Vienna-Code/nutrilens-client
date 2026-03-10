import { Link, useParams, useSearchParams } from 'wouter'
import styles from './styles.module.scss'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import { PiCaretLeftBold, PiChatCircleBold, PiPaperPlaneRightBold, PiPencilBold, PiThumbsDownBold, PiThumbsDownFill, PiThumbsUpBold, PiThumbsUpFill } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import { parseRank } from '../../../utils/ranks'
import { AnimatePresence, motion } from 'framer-motion'
import Comment from '../../../components/Comment'
import { useAllStore } from '../../../store/useAllStore'
import { imageURL } from '../../../utils/images'
import { parseHour } from '../../../utils/dates'
import ImageVisualizer from '../../../components/ImageVisualizer'
import NotFound from '../../../components/NotFound'

const Post = () => {
	const { id } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const comment = searchParams.get('comment')
	const user = useAllStore(state => state.user)
	const [post, setPost] = useState<Post|null>()
	const [comments, setComments] = useState<UserComment[]>()
	const [page, setPage] = useState(1)
	const [rankIndex, setRankIndex] = useState(0)
	const [serverLike, setServerLike] = useState<boolean|null>(null)
	const [clientLike, setClientLike] = useState<boolean|null>()
	const [viewImages, setViewImages] = useState<number>()
	const buttonRef = useRef<HTMLButtonElement>(null)
	const commentRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (comment !== null && post) {
			setSearchParams([])
		}
	}, [post])
	
	useEffect(() => {
		if (id) {
			Api.getPost(+id).then((data: Post) => {
				setRankIndex(parseRank.findIndex(({ rank, points }, i) => rank == data.user.userRank && (i == 0 ? data.user.points >= 0 && data.user.points < points : data.user.points >= parseRank[i - 1].points && data.user.points < points)))
				setServerLike(data.liked)

				setPost(data)
			}).catch(() => setPost(null))

			Api.getComments(+id, `${page}`).then(data => {
				setComments(data)
				setPage(prev => prev + 1)
			})
		}
	}, [id])

	const handleLike = (positive: boolean) => () => {
		const newLike = clientLike === undefined ? (serverLike == positive ? null : positive) : clientLike !== null ? (clientLike == positive ? null : positive) : positive
		if (id) Api.likePost(+id, newLike)

		setClientLike(() => newLike)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { comment } = e.currentTarget

		if (!id) return

		Api.addComment(+id, comment.value).then(({ id: cid }) => {
			comment.value = ''
			
			Api.getComment(+id, cid).then(comment => {
				setComments(prev => prev ? [comment, ...prev] : [comment])
			})
		})
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		const { key, shiftKey } = e

		if (!shiftKey && key === 'Enter' && buttonRef.current) {
			e.preventDefault()
			buttonRef.current.click()
		}
	}

	const addReply = (id: number, comment: UserComment) => {
		if (!comments) return

		const findComment = comments.find(x => x.id == id)
		const commentIndex = comments.findIndex(x => x.id == id)
		
		if (!findComment) return

		const newComments = comments
		findComment.replies.push(comment)
		comments.splice(commentIndex, 1, findComment)

		setComments(() => newComments)
	}

	const isLike = (positive: boolean) => {
		const thumbsIcons = {
			true: {
				bold: <PiThumbsUpBold />,
				fill: <PiThumbsUpFill />
			},
			false: {
				bold: <PiThumbsDownBold />,
				fill: <PiThumbsDownFill />
			}
		}
		
		if (clientLike !== undefined) {
			if (clientLike === null) return thumbsIcons[`${positive}`].bold
			return positive ? (clientLike ? thumbsIcons[`${positive}`].fill : thumbsIcons[`${positive}`].bold) : (!clientLike ? thumbsIcons[`${positive}`].fill : thumbsIcons[`${positive}`].bold)
		}

		if (serverLike === null) return thumbsIcons[`${positive}`].bold
		return positive ? (serverLike ? thumbsIcons[`${positive}`].fill : thumbsIcons[`${positive}`].bold) : (!serverLike ? thumbsIcons[`${positive}`].fill : thumbsIcons[`${positive}`].bold)
	}

	const calcLikes = () => {
		if (!post) return

		if (clientLike === undefined || serverLike === clientLike) return post.upvotes
		if (clientLike === null && serverLike !== null) return serverLike ? post.upvotes - 1 : post.upvotes + 1
		if (serverLike === null) return clientLike ? post.upvotes + 1 : post.upvotes - 1
		if (serverLike) return clientLike ? post.upvotes : post.upvotes - 2
		
		return clientLike ? post.upvotes + 2 : post.upvotes
	}

	const openImage = (index: number) => () => {
		setViewImages(index)
	}
	
	return (
		<div className={styles.post}>
			{post === undefined ? <LoadingPage />
			: post ?
				<>
					<AnimatePresence>
						{viewImages !== undefined && post.attachments && <ImageVisualizer {...{viewImages, setViewImages}} images={post.attachments} />}
					</AnimatePresence>
					<Link to='/..'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.fullPost}>
						<div className={styles.top}>
							<div className={styles.profilePic}>
								<img src={post.user.profilePicture ? `/api/images/${post.user.profilePicture}` : `https://ui-avatars.com/api/?name=${post.user.username}&background=3b9c6a&color=1c1c1c&size=48&font-size=0.35&uppercase=true`} alt="" />
							</div>
							<div className={styles.info}>
								<div className={styles.name}>
									{post.user.username}
									<Tippy content={parseRank[rankIndex].text}>
										<div className={styles.badge}>
											<img src={parseRank[rankIndex].badge} alt="" />
										</div>
									</Tippy>
								</div>
								<div className={styles.date}>
									{post.updatedAt !== post.createdAt &&
										<Tippy content={`Editado el ${Intl.DateTimeFormat('es-UY', { dateStyle: 'short', timeStyle: 'short', hour12: false }).format(parseHour(post.updatedAt))}`}>
											<div className={styles.icon}>
												<PiPencilBold />
											</div>
										</Tippy>
									}
									{Intl.DateTimeFormat('es-UY', { dateStyle: 'short', timeStyle: 'short', hour12: false }).format(parseHour(post.createdAt))}
								</div>
							</div>
						</div>
						<div className={styles.content}>
							<div className={styles.title}>
								{post.title}
							</div>
							<div className={styles.summary}>
								{post.content}
							</div>
						</div>
						{post.attachments &&
							<div className={styles.attachments}>
								{post.attachments.length === 1 ?
									<div className={`${styles.attachment} ${styles.wfull} ${styles.hfull}`} onClick={openImage(1)}>
										<img src={imageURL(post.attachments[0])} alt="" />
									</div>
								: post.attachments.length % 3 === 0 ?
									post.attachments.length === 3 ?
										post.attachments.map((uuid, i) => {
											if (i == 0) return (
												<div className={`${styles.attachment} ${styles.whalf} ${styles.hfull}`} key={uuid} onClick={openImage(i)}>
													<img src={imageURL(uuid)} alt="" />
												</div>
											)

											return (
												<div className={`${styles.attachment} ${styles.whalf} ${styles.hhalf}`} key={uuid} onClick={openImage(i)}>
													<img src={imageURL(uuid)} alt="" />
												</div>
											)
										})
									: post.attachments.map((uuid, i) => {
										if (i <= 2) {
											if (i == 0) return (
												<div className={`${styles.attachment} ${styles.whalf} ${styles.hfull}`} key={uuid} onClick={openImage(i)}>
													<img src={imageURL(uuid)} alt="" />
												</div>
											)
											
											return (
												<div className={`${styles.attachment} ${styles.whalf} ${styles.hhalf}`} key={uuid} onClick={openImage(i)}>
													<img src={imageURL(uuid)} alt="" />
												</div>
											)
										}

										return (
											<div className={`${styles.attachment} ${styles.wthird} ${styles.hhalf}`} key={uuid} onClick={openImage(i)}>
												<img src={imageURL(uuid)} alt="" />
											</div>
										)
									})
								: post.attachments.length % 2 === 0 && post.attachments.length < 5 ?
									post.attachments.length === 2 ?
										post.attachments.map((uuid, i) => (
											<div className={`${styles.attachment} ${styles.whalf} ${styles.hfull}`} key={uuid} onClick={openImage(i)}>
												<img src={imageURL(uuid)} alt="" />
											</div>
										))
									:
										post.attachments.map((uuid, i) => (
											<div className={`${styles.attachment} ${styles.whalf} ${styles.hhalf}`} key={uuid} onClick={openImage(i)}>
												<img src={imageURL(uuid)} alt="" />
											</div>
										))
								: (post.attachments.length - 1) % 3 === 0 ? 
									<>
										{post.attachments.slice(0, 1).map((uuid, i) => (
											<div className={`${styles.attachment} ${styles.wfull} ${styles.hfull}`} key={uuid} onClick={openImage(i)}>
												<img src={imageURL(uuid)} alt="" />
											</div>
										))}
										{post.attachments.slice(1).map((uuid, i) => (
											<div className={`${styles.attachment} ${styles.wthird} ${styles.hhalf}`} key={uuid} onClick={openImage(i + 1)}>
												<img src={imageURL(uuid)} alt="" />
											</div>
										))}
									</>
								:
									<>
										{post.attachments.slice(0, 2).map((uuid, i) => (
											<div className={`${styles.attachment} ${styles.whalf} ${styles.hfull}`} key={uuid} onClick={openImage(i)}>
												<img src={imageURL(uuid)} alt="" />
											</div>
										))}
										{post.attachments.slice(2).map((uuid, i) => (
											<div className={`${styles.attachment} ${styles.wthird} ${styles.hhalf}`} key={uuid} onClick={openImage(i + 2)}>
												<img src={imageURL(uuid)} alt="" />
											</div>
										))}
									</>
								}
							</div>
						}
						<div className={styles.actions}>
							<div className={styles.likes}>
								<motion.button className={styles.icon} whileTap={{ scale: 1.1, rotate: -25 }} onClick={handleLike(true)} disabled={(user && user !== 'guest') ? post.user.id === user.id : user === 'guest'}>
									{isLike(true)}
								</motion.button>
								<motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} key={`${id}${clientLike !== null ? (clientLike ? post.upvotes + 1 : post.upvotes - 1) : post.upvotes}`}>
									{calcLikes()}
								</motion.span>
								<motion.button className={styles.icon} whileTap={{ scale: 1.1, rotate: 25 }} onClick={handleLike(false)} disabled={(user && user !== 'guest') ? post.user.id === user.id : user === 'guest'}>
									{isLike(false)}
								</motion.button>
							</div>
							<motion.button whileTap={{ scale: 1.1 }} className={styles.comments} onClick={() => commentRef.current && commentRef.current.focus()} disabled={user === 'guest'}>
								<div className={styles.icon}>
									<PiChatCircleBold />
								</div>
								{comments ? comments.length : 0}
							</motion.button>
							{user && user !== 'guest' && user.id === post.user.id &&
								<Link to='/edit'>
									<div className={styles.icon}>
										<PiPencilBold />
									</div>
									Editar
								</Link>
							}
						</div>
						<div className={styles.comments}>
							<form onSubmit={handleSubmit}>
								<fieldset>
									<label htmlFor="comment">Únete a la conversación</label>
									<textarea name='comment' id='comment' placeholder='' ref={commentRef} onKeyDown={handleKeyDown} autoFocus={comment !== null}></textarea>
								</fieldset>
								<button type='submit' ref={buttonRef}><PiPaperPlaneRightBold /></button>
							</form>
							<div className={styles.list}>
								{comments &&
									comments.length > 0 ?
										comments.map(comment => <Comment key={comment.id} {...{comment, addReply}} />)
									:
										'No hay comentarios, ¡sé el primero!'
								}
							</div>
						</div>
					</div>
				</>
			:
				<NotFound title='Post no encontrado' message='Verifica que la URL sea correcta o vuelve al inicio' icon='404' buttonText='Inicio' buttonIcon='post' link={`~/community`} />
			}
		</div>
	)
}

export default Post