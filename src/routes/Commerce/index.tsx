import { useLocation, useParams } from 'wouter'
import styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import Map from '../../components/Map'
import { PiCaretLeftBold, PiCheckBold, PiEnvelopeBold, PiMapPinBold, PiPathBold, PiPhoneBold, PiSealCheckBold, PiThumbsUpBold, PiWalletBold, PiXBold } from 'react-icons/pi'
import Api from '../../utils/api'
import { useAllStore } from '../../store/useAllStore'

const Commerce = () => {
	const { id } = useParams()
	const [, navigate] = useLocation()
	const [commerce, setCommerce] = useState<Commerce|null>()
	const userLocation = useAllStore(state => state.userLocation)

	useEffect(() => {
		if (commerce !== undefined) return

		Api.getCommerce(id as string)
		.then(data => {
			console.log(data.data)
			setCommerce(data.data)
		})
	})

	const handleRoute = () => {
		if (!userLocation || !commerce) return

		Api.traceRoute([userLocation.lng, userLocation.lat], [commerce.coordsLon, commerce.coordsLat], 'foot')
	}

	const typeMap = {
		'kiosk': 'Kiosco',
		'supermarket': 'Supermercado',
		'restaurant': 'Restaurante'
	}

	const paymentMap = [
		{ name: 'efectivo', text: 'Efectivo' },
		{ name: 'credito', text: 'Crédito' },
		{ name: 'debito', text: 'Débito' }
	]
	
	return (
		<div className={styles.location}>
			{commerce ?
				<>
					<div className={styles.back} onClick={() => navigate('/search')}>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</div>
					<div className={styles.map}>
						<Map disableLocation markers={[{coords: [commerce.coordsLat, commerce.coordsLon], text: commerce.name}]} center={[commerce.coordsLat, commerce.coordsLon]} />
					</div>
					<div className={styles.info}>
						<div className={styles.name}>
							{commerce.name}
							{commerce.verified &&
								<div className={styles.icon}>
									<PiSealCheckBold />
								</div>
							}
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
							<div className={styles.type}>
								{typeMap[commerce.type]}
							</div>
							<button className={styles.route} onClick={handleRoute}>
								Cómo llegar
								<div className={styles.icon}>
									<PiPathBold />
								</div>
							</button>
						</div>
						<div className={styles.summary}>
							<div className={styles.item}>
								<div className={styles.icon}>
									<PiMapPinBold />
								</div>
								{commerce.address}
							</div>
							<div className={styles.item}>
								<div className={styles.icon}>
									<PiPhoneBold />
								</div>
								{commerce.contactInfo.number}
							</div>
							<div className={styles.item}>
								<div className={styles.icon}>
									<PiEnvelopeBold />
								</div>
								{commerce.contactInfo.email}
							</div>
							<div className={styles.checks}>
								<div className={styles.icon}>
									<PiWalletBold />
								</div>
								<div className={styles.subItems}>
									{paymentMap.map(({ name, text }) => (
										<div className={`${styles.subItem} ${!commerce.paymentMethods.includes(name as 'credito'|'efectivo'|'debito') ? styles.disabled : ''}`} key={name}>
											<div className={styles.icon}>
												{commerce.paymentMethods.includes(name as 'credito'|'efectivo'|'debito') ? <PiCheckBold /> : <PiXBold />}
											</div>
											{text}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</>
			:
				'hola'
			}
		</div>
	)
}

export default Commerce