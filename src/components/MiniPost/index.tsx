import { useLocation } from 'wouter'
import styles from './styles.module.scss'
import { parseRank } from '../../utils/ranks'
import { PiChatCircleBold, PiImagesSquare, PiPencilBold, PiThumbsDownBold, PiThumbsDownFill, PiThumbsUpBold, PiThumbsUpFill } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Api from '../../utils/api'
import { useAllStore } from '../../store/useAllStore'
import { parseHour } from '../../utils/dates'

const MiniPost = ({ post }: { post: Post }) => {
	const { id, user: postUser, liked, upvotes, createdAt, updatedAt, title, content, totalComments, attachments } = post
	const user = useAllStore(state => state.user)
	const [, navigate] = useLocation()
	const rankIndex = parseRank.findIndex(({ rank, points }, i) => rank == postUser.userRank && (i == 0 ? postUser.points >= 0 && postUser.points < points : postUser.points >= parseRank[i - 1].points && postUser.points < points))
	const [clientLike, setClientLike] = useState<boolean|null>()

	const handleLike = (positive: boolean) => () => {
		const newLike = clientLike === undefined ? (liked == positive ? null : positive) : clientLike !== null ? (clientLike == positive ? null : positive) : positive
		if (id) Api.likePost(+id, newLike)

		setClientLike(() => newLike)
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

		if (liked === null) return thumbsIcons[`${positive}`].bold
		return positive ? (liked ? thumbsIcons[`${positive}`].fill : thumbsIcons[`${positive}`].bold) : (!liked ? thumbsIcons[`${positive}`].fill : thumbsIcons[`${positive}`].bold)
	}

	const calcLikes = () => {
		if (clientLike === undefined || liked === clientLike) return upvotes
		if (clientLike === null && liked !== null) return liked ? upvotes - 1 : upvotes + 1
		if (liked === null) return clientLike ? upvotes + 1 : upvotes - 1
		if (liked) return clientLike ? upvotes : upvotes - 2
		
		return clientLike ? upvotes + 2 : upvotes
	}
	
	return (
		<div className={styles.miniPost} onClick={() => navigate(`/${id}`)}>
			<div className={styles.top}>
				<div className={styles.profilePic} onClick={e => e.stopPropagation()}>
					<img src={postUser.profilePicture ? `/api/images/${postUser.profilePicture}` : `https://ui-avatars.com/api/?name=${postUser.username}&background=3b9c6a&color=1c1c1c&size=48&font-size=0.35&uppercase=true`} alt="" />
				</div>
				<div className={styles.info} onClick={e => e.stopPropagation()}>
					<div className={styles.name}>
						{postUser.username}
						<Tippy content={parseRank[rankIndex].text}>
							<div className={styles.badge}>
								<img src={parseRank[rankIndex].badge} alt="" />
							</div>
						</Tippy>
					</div>
					<div className={styles.date}>
						{updatedAt !== createdAt &&
							<Tippy content={`Editado el ${Intl.DateTimeFormat('es-UY', { dateStyle: 'short', timeStyle: 'short', hour12: false }).format(parseHour(updatedAt))}`}>
								<div className={styles.icon}>
									<PiPencilBold />
								</div>
							</Tippy>
						}
						{Intl.DateTimeFormat('es-UY', { dateStyle: 'short', timeStyle: 'short', hour12: false }).format(parseHour(createdAt))}
					</div>
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.title}>
					{title}
				</div>
				<div className={styles.summary}>
					{content.length > 280 ? `${content.slice(0, 280)}...` : content}
				</div>
				{attachments &&
					<div className={styles.attachments}>
						<div className={styles.icon}>
							<PiImagesSquare />
						</div>
						{attachments.length} {attachments.length > 1 ? 'imágenes adjuntas' : 'imagen adjunta'}
					</div>
				}
			</div>
			<div className={styles.actions}>
				<div className={styles.likes} onClick={e => e.stopPropagation()}>
					<motion.button className={styles.icon} whileTap={{ scale: 1.1, rotate: -25 }} onClick={handleLike(true)} disabled={user && user !== 'guest' ? postUser.id === user.id : false}>
						{isLike(true)}
					</motion.button>
					<motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} key={`${id}${clientLike !== null ? (clientLike ? upvotes + 1 : upvotes - 1) : upvotes}`}>
						{calcLikes()}
					</motion.span>
					<motion.button className={styles.icon} whileTap={{ scale: 1.1, rotate: 25 }} onClick={handleLike(false)} disabled={user && user !== 'guest' ? postUser.id === user.id : false}>
						{isLike(false)}
					</motion.button>
				</div>
				<motion.button className={styles.comments} onClick={e => { e.stopPropagation(); navigate(`/${id}?comment`) }} whileTap={{ scale: 1.1 }}>
					<div className={styles.icon}>
						<PiChatCircleBold />
					</div>
					{totalComments}
				</motion.button>
			</div>
		</div>
	)
}

export default MiniPost