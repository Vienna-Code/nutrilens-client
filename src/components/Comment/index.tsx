import Tippy from '@tippyjs/react'
import { parseRank } from '../../utils/ranks'
import styles from './styles.module.scss'
import { PiArrowBendUpLeftBold, PiPaperPlaneRightBold, PiPencilBold } from 'react-icons/pi'
import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import Api from '../../utils/api'
import { Link, useLocation, useParams } from 'wouter'
import { parseHour } from '../../utils/dates'

const Comment = ({ comment, sub }: { comment: UserComment, sub?: boolean }) => {
	const { id: pid } = useParams()
	const { id, user, content, createdAt, updatedAt, replies, taggingUser } = comment
	const [, navigate] = useLocation()
	const [repliesCount, setRepliesCount] = useState(0)
	const [addedReplies, setAddedReplies] = useState<UserComment[]>([])
	const [replying, setReplying] = useState<{ id: number, username: string }>()
	const submit = useRef<HTMLButtonElement>(null)
	const rankIndex = parseRank.findIndex(({ rank, points }, i) => rank == user.userRank && (i == 0 ? user.points >= 0 && user.points < points : user.points >= parseRank[i - 1].points && user.points < points))

	const handleSeeReplies = () => {
		if (repliesCount >= replies.length) return

		setRepliesCount(prev => prev + 3)
	}

	const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		const { key, shiftKey } = e

		if (!shiftKey && key === 'Enter' && submit.current) {
			e.preventDefault()
			submit.current.click()
		}
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { reply } = e.currentTarget

		if (!pid) return
		
		Api.addComment(+pid, reply.value, id).then(({ id: cid }) => {
			setReplying(undefined)
			
			Api.getComment(+pid, cid).then(comment => {
				setAddedReplies(prev => [...prev, comment])
			})
		})
	}
	
	return (
		<div className={styles.comment}>
			<div className={styles.userInfo}>
				<div className={styles.profilePic} onClick={() => navigate(`~/user/${user.id}`)}>
					<img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=3b9c6a&color=1c1c1c&size=48&font-size=0.35&uppercase=true`} alt="" />
				</div>
				<div className={styles.info}>
					<div className={styles.name}>
						<Link to={`~/user/${user.id}`}>{user.username}</Link>
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
				{taggingUser &&
					<div className={styles.replyingTo}>
						Respondiendo a <Link to={`~/user/${taggingUser.id}`}>@{taggingUser.username}</Link>
					</div>
				}
				{content}
			</div>
			<div className={styles.interactions}>
				<button className={styles.reply} onClick={() => setReplying(prev => !prev ? { id: user.id, username: user.username } : undefined)}>
					<div className={styles.icon}>
						<PiArrowBendUpLeftBold />
					</div>
					Responder
				</button>
			</div>
			{replying &&
				<form onSubmit={handleSubmit}>
					<fieldset className={styles.replying}>
						<label htmlFor={`replying${id}`}>Respondiendo a {replying.username}</label>
						<textarea name='reply' id={`replying${id}`} placeholder='' autoFocus onKeyDown={handleKey}></textarea>
					</fieldset>
					<button ref={submit} type='submit'><PiPaperPlaneRightBold /></button>
				</form>
			}
			<div className={styles.replies}>
				<div className={`${styles.subComments}${sub ? styles.sub : ''}`}>
					{replies.filter((_x, i) => i + 1 <= repliesCount).map(comment => {
						return <Comment key={comment.id} {...{comment}} sub />
					})}
					{addedReplies.map(comment => <Comment key={comment.id} {...{comment}} sub />)}
				</div>
				{repliesCount < replies.length &&
					<button onClick={handleSeeReplies}>
						Ver más respuestas ({replies.length - repliesCount})
					</button>
				}
			</div>
		</div>
	)
}

export default Comment