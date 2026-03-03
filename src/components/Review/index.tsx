import { useState } from 'react'
import Api from '../../utils/api'
import { parseRank } from '../../utils/ranks'
import styles from './styles.module.scss'
import { useParams } from 'wouter'
import { PiPencilBold, PiThumbsDownBold, PiThumbsDownFill, PiThumbsUpBold, PiThumbsUpFill } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import { parseHour } from '../../utils/dates'
import { motion } from 'framer-motion'
import { useAllStore } from '../../store/useAllStore'

const Review = ({ review }: { review: Review }) => {
	const { id: cid } = useParams()
	const user = useAllStore(state => state.user)
	const { id, user: reviewUser, content, liked, positive, useful, updatedAt, createdAt } = review
	const rankIndex = parseRank.findIndex(({ rank, points }, i) => rank == reviewUser.userRank && (i == 0 ? reviewUser.points >= 0 && reviewUser.points < points : reviewUser.points >= parseRank[i - 1].points && reviewUser.points < points))
	const [clientLike, setClientLike] = useState<boolean|null>()

	const handleLike = (positive: boolean) => () => {
		const newLike = clientLike === undefined ? (liked == positive ? null : positive) : clientLike !== null ? (clientLike == positive ? null : positive) : positive
		if (cid) Api.likeReview(+cid, +id, newLike)

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
		if (clientLike === undefined || liked === clientLike) return useful
		if (clientLike === null && liked !== null) return liked ? useful - 1 : useful + 1
		if (liked === null) return clientLike ? useful + 1 : useful - 1
		if (liked) return clientLike ? useful : useful - 2
		
		return clientLike ? useful + 2 : useful
	}

	const dateFormat = Intl.DateTimeFormat('es-UY', { dateStyle: 'medium', timeStyle: 'short', hour12: false })
	
	return (
		<div className={styles.review} key={id}>
			<div className={styles.user}>
				<div className={styles.profilePic}>
					<img src={reviewUser.profilePicture || `https://ui-avatars.com/api/?name=${reviewUser.username}&background=3b9c6a&color=1c1c1c&size=48&font-size=0.35&uppercase=true`} alt="" />
				</div>
				<div className={styles.info}>
					<div className={styles.name}>
						{reviewUser.username}
						<Tippy content={parseRank[rankIndex].text}>
							<div className={styles.badge}>
								<img src={parseRank[rankIndex].badge} alt="" />
							</div>
						</Tippy>
					</div>
					<div className={styles.createdAt}>
						{updatedAt !== createdAt &&
							<Tippy content={`Editado el ${dateFormat.format(parseHour(updatedAt))}`}>
								<div className={styles.icon}>
									<PiPencilBold />
								</div>
							</Tippy>
						}
						{dateFormat.format(parseHour(createdAt))}
					</div>
				</div>
			</div>
			<div className={styles.userRating}>
				<div className={styles.icon}>
					{positive ? <PiThumbsUpBold /> : <PiThumbsDownBold />}
				</div>
				{positive ? 'Recomendado' : 'No recomendado'}
			</div>
			<div className={styles.content}>
				{content}
			</div>
			<div className={styles.interactions}>
				<motion.button className={styles.icon} whileTap={{ scale: 1.1, rotate: -25 }} onClick={handleLike(true)} disabled={(user && user !== 'guest') ? reviewUser.id === user.id : user === 'guest'}>
					{isLike(true)}
				</motion.button>
				<motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} key={`${id}${clientLike !== null ? (clientLike ? useful + 1 : useful - 1) : useful}`}>
					{calcLikes()}
				</motion.span>
				<motion.button className={styles.icon} whileTap={{ scale: 1.1, rotate: 25 }} onClick={handleLike(false)} disabled={(user && user !== 'guest') ? reviewUser.id === user.id : user === 'guest'}>
					{isLike(false)}
				</motion.button>
			</div>
		</div>
	)
}

export default Review