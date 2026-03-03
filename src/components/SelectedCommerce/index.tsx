import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import Api from '../../utils/api'
import LoadingChild from '../LoadingChild'
import { motion } from 'framer-motion'
import { useAllStore } from '../../store/useAllStore'
import { PiBreadBold, PiEyeBold, PiForkKnifeBold, PiPathBold, PiSealBold, PiSealCheckBold, PiShoppingCartBold, PiStorefrontBold, PiThumbsUpBold } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import { useLocation } from 'wouter'

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

const SelectedCommerce = ({ id }: { id: string }) => {
	const [loading, setLoading] = useState(true)
	const [commerce, setCommerce] = useState<Commerce>()
	const setSelectedCommerce = useAllStore(state => state.setSelectedCommerce)
	const ref = useRef<HTMLDivElement>(null)
	const [, navigate] = useLocation()
	
	const clickOutside = (e: MouseEvent) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			setSelectedCommerce(undefined)
		}
	}

	useEffect(() => {
		if (ref.current) {
			document.addEventListener('click', clickOutside, { capture: true })
		}
		
		return () => document.removeEventListener('click', clickOutside, { capture: true })
	}, [])
	
	useEffect(() => {
		setLoading(true)
		
		Api.getCommerce(id)
		.then(data => {
			setLoading(false)
			setCommerce(data.data)
		})
	}, [id])
	
	return (
		<motion.div className={styles.selectedCommerce} initial={{ y: '100%' }} animate={{ y: '4em' }} exit={{ y: '100%' }} ref={ref}>
			<div className={styles.wrapper}>
				{loading && <div className={styles.loading}><LoadingChild /></div>}
				{commerce &&
					<div className={styles.commerceData}>
						<div className={styles.top}>
							<div className={styles.title}>
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
								{typeMap[commerce.type].text}
								<div className={styles.icon}>
									{typeMap[commerce.type].icon}
								</div>
							</div>
						</div>
						<div className={styles.quickActions}>
							<button onClick={() => navigate(`/commerce/${id}`)}>
								<div className={styles.icon}>
									<PiEyeBold />
								</div>
								Ver más
							</button>
							<button>
								<div className={styles.icon}>
									<PiPathBold />
								</div>
								Cómo llegar
							</button>
						</div>
					</div>
				}
			</div>
		</motion.div>
	)
}

export default SelectedCommerce