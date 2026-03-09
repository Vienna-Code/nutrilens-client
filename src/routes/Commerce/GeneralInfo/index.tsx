import { useState, type Dispatch, type SetStateAction } from 'react'
import { useAllStore } from '../../../store/useAllStore'
import styles from './styles.module.scss'
import Api from '../../../utils/api'
import { PiCaretRightBold, PiCheckBold, PiClockBold, PiEnvelopeBold, PiMapPinBold, PiPathBold, PiPencilBold, PiPhoneBold, PiPlusBold, PiQuestionMarkBold, PiSealQuestionBold, PiWalletBold, PiXBold } from 'react-icons/pi'
import ProductsSummary from '../ProductsSummary'
import { parseHour } from '../../../utils/dates'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import Tippy from '@tippyjs/react'
import ImageVisualizer from '../../../components/ImageVisualizer'
	
const GeneralInfo = ({ commerce, setLocalVerify }: { commerce: Commerce, setLocalVerify: Dispatch<SetStateAction<boolean | undefined>> }) => {
	const userLocation = useAllStore(state => state.userLocation)
	const user = useAllStore(state => state.user)
	const setRouteTo = useAllStore(state => state.setRouteTo)
	const [, navigate] = useLocation()
	const [summary, setSummary] = useState(false)
	const [verifyModal, setVerifyModal] = useState(false)
	const [verified, setVerified] = useState<boolean>()
	const [viewImages, setViewImages] = useState<number>()

	const handleRoute = () => {
		if (!userLocation || !commerce) return

		setRouteTo(commerce)
		navigate('~/')
	}

	const handleVerify = (verify: boolean) => () => {
		if (!user || user === 'guest') return
		
		if (user.roles.includes('ROLE_ADMIN')) {
			return Api.verifyCommerceAdmin(commerce.id, verify)
			.then((data) => {
				setVerifyModal(false)
				setLocalVerify(data.data.verified)
				setVerified(verify)
			})
		}
		
		Api.verifyCommerce(commerce.id, verify)
		.then(() => {
			setVerifyModal(false)
			setVerified(verify)
		})
	}

	const paymentMap = [
		{ name: 'efectivo', text: 'Efectivo' },
		{ name: 'credito', text: 'Crédito' },
		{ name: 'debito', text: 'Débito' }
	]

	const parseNumber = (number?: string) => {
		if (!number) return number
		
		const prefix = number.slice(0, 4)
		const rest = number.slice(4).split('')
		const parse = rest.length === 8 ? `${rest.slice(0, 4).join('')} ${rest.slice(4, 8).join('')}` : rest.length === 9 ? `${rest.slice(0, 3).join('')} ${rest.slice(3, 6).join('')} ${rest.slice(6, 9).join('')}` : rest.join('')
		const newNumber = `${prefix} ${parse}`

		return newNumber
	}

	const days = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado'
	]
	const parseDays = days.map((_x, i) => {
		const findDay = commerce.commerceSchedules.find(x => x.weekday === i)

		if (!findDay) return {
			weekday: i,
			opensAt: '',
			closesAt: '',
			closed: true
		}

		return {
			...findDay,
			closed: false
		}
	})
	const today = new Date().getDay()
	const orderDays = today === 0 ? parseDays : parseDays.slice(today, today === days.length - 1 ? undefined : parseDays.length).concat(parseDays.slice(0, today))
	const hourFormat = Intl.DateTimeFormat('es-UY', { timeStyle: 'short', hour12: false })
	
	return (
		<div className={styles.summary}>
			<AnimatePresence>
				{viewImages !== undefined && commerce.commerceImages &&
					<ImageVisualizer {...{viewImages, setViewImages}} images={commerce.commerceImages} />
				}
			</AnimatePresence>
			<AnimatePresence mode='wait'>
				{verifyModal &&
						<motion.div className={styles.verifyModal} onClick={() => setVerifyModal(false)} initial={{ backgroundColor: 'var(--pr-color-tp)' }} animate={{ backgroundColor: 'var(--pr-color-op)' }} exit={{ position: 'fixed', opacity: 0 }}>
							<motion.div className={styles.modal} onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
								<div className={styles.text}>
									<div className={styles.icon}>
										<PiSealQuestionBold />
									</div>
									<p>¿Existe realmente este comercio?</p>
								</div>
								<div className={styles.actions}>
									{(commerce.userVerificationReport !== null && commerce.userVerificationReport && verified === undefined) || verified !== undefined && verified ?
										<Tippy content={'Ya votaste este comercio como existente'}>
											<button className={styles.disabled}>Existe</button>
										</Tippy>
									:
										<button onClick={handleVerify(true)}>Existe</button>
									}
									{(commerce.userVerificationReport !== null && !commerce.userVerificationReport && verified === undefined) || verified !== undefined && !verified ?
										<Tippy content={'Ya votaste este comercio como no existente'}>
											<button className={styles.disabled}>No existe</button>
										</Tippy>
									:
										<button onClick={handleVerify(false)}>No existe</button>
									}
								</div>
							</motion.div>
						</motion.div>
				}
			</AnimatePresence>
			<button className={styles.route} onClick={handleRoute}>
				<div className={styles.icon}>
					<PiPathBold />
				</div>
				Cómo llegar
			</button>
			{user !== 'guest' &&
				<div className={styles.actions}>
					{commerce.submittedByUser && user && !user.roles.includes('ROLE_ADMIN') ?
						<Tippy content='No puedes verificar tu propio comercio'>
							<button className={styles.disabled}>
								<div className={styles.icon}><PiCheckBold /></div>
								Verificado
							</button>
						</Tippy>
					:
						<button onClick={() => setVerifyModal(true)}>
							<AnimatePresence initial={false} mode='popLayout'>
								<motion.div className={styles.icon} key={`${verified}`} initial={{ rotate: verified ? 360 : -360, scale: 1.5 }} animate={{ rotate: 0, scale: 1 }}>
									{commerce.userVerificationReport === null && verified === undefined ?
										<PiQuestionMarkBold />
									: verified === undefined ?
										(commerce.userVerificationReport ?
											<PiCheckBold />
										:
											<PiXBold />
										)
									: verified ?
										<PiCheckBold />
									:
										<PiXBold />
									}
								</motion.div>
							</AnimatePresence>
							{commerce.userVerificationReport !== null || verified !== undefined ? 'Verificado' : 'Verificar'}
						</button>
					}
					{!user || !user.roles.includes('ROLE_ADMIN') && user.userRank === 'bronze' || user.userRank === 'silver' ?
						<Tippy content='Debes ser de rango oro o superior para editar un comercio'>
							<button className={styles.disabled}>
								<div className={styles.icon}>
									<PiPencilBold />
								</div>
								Editar
							</button>
						</Tippy>
					:
						<button onClick={() => navigate('/edit')}>
							<div className={styles.icon}>
								<PiPencilBold />
							</div>
							Editar
						</button>
					}
				</div>
			}
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
				{parseNumber(commerce.contactInfo?.number) || <div className={styles.empty}>No especificado</div>}
			</div>
			<div className={styles.item}>
				<div className={styles.icon}>
					<PiEnvelopeBold />
				</div>
				{commerce.contactInfo?.email || <div className={styles.empty}>No especificado</div>}
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
			<div className={styles.details}>
				<div className={styles.icon}>
					<PiClockBold />
				</div>
				{commerce.commerceSchedules.length > 0 ?
					<details>
						<summary onClick={() => setSummary(!summary)}>
							<motion.div animate={{ rotate: summary ? 90 : 0 }} className={styles.arrow}><PiCaretRightBold /></motion.div>
							<div className={styles.dayName}>{days[today]}</div>
							{!orderDays[today].closed ? `${hourFormat.format(parseHour((orderDays[today].opensAt)))} - ${hourFormat.format(parseHour((orderDays[today].closesAt)))}` : 'Cerrado'}
						</summary>
						<div className={styles.days}>
							{orderDays.filter((_x, i) => i !== 0).map(({ opensAt, closesAt, weekday, closed }, i) => {
								return (
									<div className={styles.day} key={i}>
										<div className={styles.dayName}>
											{days[weekday]}
										</div>
										{!closed ? `${hourFormat.format(parseHour(opensAt))} - ${hourFormat.format(parseHour(closesAt))}`
										: 'Cerrado'}
									</div>
								)
							})}
						</div>
					</details>
				:
					<div className={styles.empty}>
						No especificados
					</div>
				}
			</div>
			{commerce.products.length > 0 &&
				<ProductsSummary products={commerce.products} />
			}
			{user !== 'guest' &&
				<button onClick={() => navigate('/products/add')}>
					<div className={styles.icon}>
						<PiPlusBold />
					</div>
					Añadir producto
				</button>
			}
			{commerce.commerceImages &&
				<div className={styles.images}>
					<div className={styles.imagesTitle}>
						<h3>Imágenes del comercio</h3>
					</div>
					<div className={styles.list}>
						{commerce.commerceImages.map((uuid, i) => (
							<div className={styles.image} key={uuid} onClick={() => setViewImages(i)}>
								<img src={`${import.meta.env.VITE_API_URL}/images/${uuid}`} alt="" />
							</div>
						))}
					</div>
				</div>
			}
		</div>
	)
}

export default GeneralInfo