import styles from './styles.module.scss'
import { useAllStore } from '../../store/useAllStore'
import { Link, useLocation } from 'wouter'
import { PiCaretLeftBold, PiMapPinBold, PiThumbsDownBold, PiThumbsUpBold } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import { parseRank } from '../../utils/ranks'
import { useEffect, useState } from 'react'
import Api from '../../utils/api'
import LoadingChild from '../../components/LoadingChild'

const Profile = () => {
	const user = useAllStore(state => state.user)
	const [, navigate] = useLocation()
	const [commerces, setCommerces] = useState<Commerce[]>()
	const [products, setProducts] = useState<Product[]>()
	const [reviews, setReviews] = useState<Review[]>()
	const [posts, setPosts] = useState<Post[]>()

	useEffect(() => {
		Api.getUserCommerces().then(setCommerces)
		Api.getUserProducts().then(setProducts)
		Api.getUserReviews().then(setReviews)
		Api.getUserPosts().then(setPosts)
	}, [])

	if (!user || user == 'guest') return null
	
	const rankIndex = parseRank.findIndex(({ rank, points }, i) => rank == user.userRank && (i == 0 ? user.points >= 0 && user.points < points : user.points >= parseRank[i - 1].points && user.points < points))
	const nextRank = rankIndex == parseRank.length - 1 ? null : parseRank[rankIndex + 1]
	
	return (
		<div className={styles.profile}>
			<Link to='/'>
				<div className={styles.icon}>
					<PiCaretLeftBold />
				</div>
				Atrás
			</Link>
			<div className={styles.basicInfo}>
				<div className={styles.profilePic}>
					<img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=3b9c6a&color=1c1c1c&size=48&font-size=0.35&uppercase=true`} alt='' />
				</div>
				<div className={styles.data}>
					<div className={styles.name}>
						{user.username}
						<Tippy content={parseRank[rankIndex].text}>
							<div className={styles.badge}>
								<img src={parseRank[rankIndex].badge} alt="" />
							</div>
						</Tippy>
					</div>
					<div className={styles.email}>
						{user.email}
					</div>
					<div className={styles.since}>
						Desde el {Intl.DateTimeFormat('es-UY', { dateStyle: 'long', timeStyle: 'short', hour12: false }).format(new Date(user.createdAt))}
					</div>
				</div>
			</div>
			<div className={styles.rank}>
				<div className={styles.progress}>
					<div className={styles.bar}>
						<div className={styles.fill} style={{ width: `${user.points}%` }}></div>
					</div>
					<div className={styles.numbers}>
						<div className={styles.specific}>
							{user.points}{nextRank && '/'}{nextRank && Math.floor(parseRank[rankIndex].points)}
						</div>
						{nextRank &&
							<div className={styles.next}>
								<div className={styles.text}>
									Siguiente: {nextRank.text}
								</div>
								<div className={styles.badge}>
									<img src={nextRank.badge} alt="" />
								</div>
							</div>
						}
					</div>
				</div>
			</div>
			<div className={styles.section}>
				<h3>Comercios añadidos</h3>
				<div className={styles.list}>
					{!commerces ? <LoadingChild />
					: commerces.length > 0 ? commerces.map(({ id, name }) => {{
						return (
							<div className={styles.item} key={id} onClick={() => navigate(`~/commerce/${id}`)}>
								<div className={styles.icon}>
									<PiMapPinBold />
								</div>
								{name}
							</div>
						)
					}})
					: <span>No has añadido ningún comercio</span>
					}
				</div>
			</div>
			<div className={styles.section}>
				<h3>Productos añadidos</h3>
				<div className={styles.list}>
					{!products ? <LoadingChild />
					: products.length > 0 ? products.map(({ id, name, commerce }) => {
						return (
							<div className={styles.item} key={id} onClick={() => navigate(`~/commerce/${commerce.id}/products/${id}`)}>
								{name}
							</div>
						)
					})
					: <span>No has añadido ningún producto</span>
					}
				</div>
			</div>
			<div className={styles.section}>
				<h3>Reseñas</h3>
				<div className={styles.list}>
					{!reviews ? <LoadingChild />
					: reviews.length > 0 ? reviews.map(({ id, positive, content }) => {
						return (
							<div className={styles.item} key={id}>
								<div className={styles.icon}>
									{positive ? <PiThumbsUpBold /> : <PiThumbsDownBold />}
								</div>
								{content.substring(0, 10)}...
							</div>
						)
					})
					: <span>No has añadido ninguna reseña</span>
					}
				</div>
			</div>
			<div className={styles.section}>
				<h3>Posts</h3>
				<div className={styles.list}>
					{!posts ? <LoadingChild />
					: posts.length > 0 ? posts.map(({ id }) => {
						return (
							<div className={styles.item} key={id}></div>
						)
					})
					: <span>No has creado ningún post</span>
					}
				</div>
			</div>
		</div>
	)
}

export default Profile