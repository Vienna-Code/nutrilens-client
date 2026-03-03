import { Link, useParams } from 'wouter'
import styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import Map from '../../components/Map'
import { PiBreadBold, PiCaretLeftBold, PiFlagBannerBold, PiForkKnifeBold, PiSealBold, PiSealCheckBold, PiShoppingCartBold, PiStorefrontBold, PiThumbsUpBold } from 'react-icons/pi'
import Api from '../../utils/api'
import { motion } from 'framer-motion'
import LoadingPage from '../../components/LoadingPage'
import GeneralInfo from './GeneralInfo'
import { useAllStore } from '../../store/useAllStore'
import Tippy from '@tippyjs/react'
import Reviews from './Reviews'

const Commerce = () => {
	const { id } = useParams()
	const user = useAllStore(state => state.user)
	const [commerce, setCommerce] = useState<Commerce|null>()
	const [reviews, setReviews] = useState<Review[]>()
	const [userReview, setUserReview] = useState<Review>()
	const [tab, setTab] = useState(0)
	const selectedCommerce = useAllStore(state => state.selectedCommerce)

	useEffect(() => {
		if (commerce !== undefined) return

		Api.getCommerce(id as string)
		.then(data => {
			setCommerce(data.data)
		})

		Api.getReviews(id as string)
		.then(data => {
			if (user === 'guest' || !user) return setReviews(data)

			const findUserReview = data.find((x: Review) => x.user.id === user.id)
			const parseReviews = findUserReview ? data.filter((x: Review) => x.user.id !== user.id) : data
			setReviews(parseReviews)

			if (findUserReview) setUserReview(findUserReview)
		})
	}, [])

	const typeMap = {
		'kiosk': {
			text: 'Kiosco',
			icon: <PiStorefrontBold />
		},
		'restaurant': {
			text: 'Restaurante',
			icon: <PiForkKnifeBold />
		},
		'supermarket': {
			text: 'Supermercado',
			icon: <PiShoppingCartBold />
		},
		'bakery': {
			text: 'Panadería',
			icon: <PiBreadBold />
		}
	}
	
	return (
		<div className={styles.location}>
			{commerce ?
				<>
					<Link to={selectedCommerce ? '~/' : '~/search'} className={styles.back}>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.map}>
						<Map disableLocation markers={[{coords: [commerce.coordsLat, commerce.coordsLon], text: commerce.name, type: commerce.type}]} center={[commerce.coordsLat, commerce.coordsLon]} />
					</div>
					<div className={styles.info}>
						<div className={styles.name}>
							{commerce.name}
							<Tippy content={commerce.verified ? 'Comercio verificado' : 'Comercio no verificado'}>
								<div className={`${styles.icon} ${commerce.verified ? styles.verified : ''}`}>
									{commerce.verified ?
										<PiSealCheckBold />
									:
										<PiSealBold />
									}
								</div>
							</Tippy>
						</div>
						<div className={styles.bottom}>
							<div className={styles.rating}>
								{commerce.totalReviews === 0 ?
									<div className={styles.noReviews}>
										No hay reseñas disponibles
									</div>
								:
									<>
										<div className={styles.icon}>
											<PiThumbsUpBold />
										</div>
										{Math.round((+commerce.positiveReviews / +commerce.totalReviews) * 100)}%
										<div className={styles.bar}>
											<div className={styles.fill} style={{ width: `${Math.round((+commerce.positiveReviews / +commerce.totalReviews) * 100)}%` }}></div>
										</div>
										({commerce.totalReviews})
									</>
								}
							</div>
							<div className={styles.bottomInfo}>
								<div className={styles.type}>
									{typeMap[commerce.type].text}
									<div className={styles.icon}>
										{typeMap[commerce.type].icon}
									</div>
								</div>
								{user !== 'guest' &&
									<Link to='/report'>
										<div className={styles.icon}>
											<PiFlagBannerBold />
										</div>
										Reportar
									</Link>
								}
							</div>
						</div>
						<div className={styles.tabs}>
							<div className={styles.tab} onClick={() => setTab(0)}>
								Información general
								{tab === 0 && <motion.div layoutId='selectedTab' className={styles.selected}></motion.div>}
							</div>
							<div className={styles.tab} onClick={() => setTab(1)}>
								Reseñas
								{tab === 1 && <motion.div layoutId='selectedTab' className={styles.selected}></motion.div>}
							</div>
						</div>
						{tab === 0 ?
							<GeneralInfo commerce={commerce} />
						:
							reviews && <Reviews positiveReviews={commerce.positiveReviews} totalReviews={commerce.totalReviews} reviews={reviews} userReview={userReview} />
						}
					</div>
				</>
			:
				<LoadingPage />
			}
		</div>
	)
}

export default Commerce