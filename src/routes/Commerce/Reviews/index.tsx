import { PiPencilLineBold, PiThumbsDownBold, PiThumbsUpBold, PiUserBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { useLocation } from 'wouter'
import { parseHour } from '../../../utils/dates'
import Tippy from '@tippyjs/react'
import { parseRank } from '../../../utils/ranks'
import { useAllStore } from '../../../store/useAllStore'
import Review from '../../../components/Review'

const reviewStates = [
	{ min: 0, max: 19, text: 'Muy negativas' },
	{ min: 20, max: 39, text: 'Mayoritariamente negativas' },
	{ min: 40, max: 69, text: 'Mixtas' },
	{ min: 70, max: 79, text: 'Mayoritariamente positivas' },
	{ min: 80, max: 100, text: 'Positivas' },
	{ min: 85, max: 100, text: 'Muy positivas', condition: 50 },
	{ min: 95, max: 100, text: 'Extremadamente positivas', condition: 500 }
]

const Reviews = ({ positiveReviews, totalReviews, reviews, userReview }: { positiveReviews: number, totalReviews: number, reviews: Review[], userReview?: Review }) => {
	const user = useAllStore(state => state.user)
	const [, navigate] = useLocation()
	const percentage = Math.round((+positiveReviews / +totalReviews) * 100)
	const rankIndex = userReview ? parseRank.findIndex(({ rank, points }, i) => rank == userReview.user.userRank && (i == 0 ? userReview.user.points >= 0 && userReview.user.points < points : userReview.user.points >= parseRank[i - 1].points && userReview.user.points < points)) : undefined

	const dateFormat = Intl.DateTimeFormat('es-UY', { dateStyle: 'medium', timeStyle: 'short', hour12: false })
	
	return (
		<div className={styles.reviews}>
			{totalReviews > 0 && 
				<div className={styles.summary}>
					<div className={styles.rating}>
						<div className={styles.icon}>
							<PiThumbsUpBold />
						</div>
						<div className={styles.percentage}>
							{percentage}%
						</div>
					</div>
					<div className={styles.separator}>
						•
					</div>
					<div className={styles.details}>
						{reviewStates.reduce((prev, curr) => {
							if (curr.min <= percentage && curr.max >= percentage) {
								if (curr.condition) {
									if (curr.condition <= totalReviews) return curr

									return prev
								}

								return curr
							}

							return prev
						}, reviewStates[0]).text}
					</div>
				</div>
			}
			{userReview &&
				<div className={styles.userReview}>
					<div className={styles.title}>
						<div className={styles.icon}>
							<PiUserBold />
						</div>
						Tu reseña
					</div>
					<div className={styles.review} key={userReview.id}>
						<div className={styles.user}>
							<div className={styles.profilePic}>
								<img src={userReview.user.profilePicture ? `${import.meta.env.VITE_API_URL}/images/${userReview.user.profilePicture}` : `https://ui-avatars.com/api/?name=${userReview.user.username}&background=3b9c6a&color=1c1c1c&size=48&font-size=0.35&uppercase=true`} alt="" />
							</div>
							<div className={styles.info}>
								<div className={styles.name}>
									{userReview.user.username}
									<Tippy content={parseRank[rankIndex as number].text}>
										<div className={styles.badge}>
											<img src={parseRank[rankIndex as number].badge} alt="" />
										</div>
									</Tippy>
								</div>
								<div className={styles.createdAt}>
									{dateFormat.format(parseHour(userReview.createdAt))}
								</div>
							</div>
						</div>
						<div className={styles.userRating}>
							<div className={styles.icon}>
								{userReview.positive ? <PiThumbsUpBold /> : <PiThumbsDownBold />}
							</div>
							{userReview.positive ? 'Recomendado' : 'No recomendado'}
						</div>
						<div className={styles.content}>
							{userReview.content}
						</div>
						<div className={styles.interactions}>
							<button disabled>
								<PiThumbsUpBold />
							</button>
							<span>
								{userReview.useful}
							</span>
						</div>
					</div>
				</div>
			}
			{user !== 'guest' &&
				<button onClick={() => navigate(userReview ? `/editReview` : '/addReview')}>
					<div className={styles.icon}>
						<PiPencilLineBold />
					</div>
					{userReview ? 'Editar reseña' : 'Escribir reseña'}
				</button>
			}
			{totalReviews > 0 ?
				<>
					<div className={styles.reviewsList}>
						{reviews.map(review => <Review key={review.id} review={review} />)}
					</div>
				</>
			:
				<div className={styles.empty}>
					<span>No hay reseñas disponibles para este comercio. ¡Sé el primero!</span>
				</div>
			}
		</div>
	)
}

export default Reviews