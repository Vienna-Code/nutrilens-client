import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Api from '../../../../utils/api'
import { Link, useLocation, useParams } from 'wouter'
import { PiCaretLeftBold, PiCheckBold, PiDropSlashBold, PiFlagBannerBold, PiGrainsSlashBold, PiImageBroken, PiPencilBold, PiQuestionMarkBold, PiSealBold, PiSealCheckBold, PiSealQuestionBold, PiXBold } from 'react-icons/pi'
import { TbCubeOff } from 'react-icons/tb'
import Tippy from '@tippyjs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAllStore } from '../../../../store/useAllStore'
import LoadingPage from '../../../../components/LoadingPage'
import ImageVisualizer from '../../../../components/ImageVisualizer'
import NotFound from '../../../../components/NotFound'

const parseTag = {
	'celiac': {
		icon: <PiGrainsSlashBold />,
		text: 'Celíaco'
	},
	'hypertensive': {
		icon: <PiDropSlashBold />,
		text: 'Hipertenso'
	},
	'diabetic': {
		icon: <TbCubeOff />,
		text: 'Diabético'
	}
}

const Product = () => {
	const { pid, id } = useParams()
	const user = useAllStore(state => state.user)
	const [product, setProduct] = useState<Product|null>()
	const [commerce, setCommerce] = useState<Commerce|null>()
	const [verifyModal, setVerifyModal] = useState(false)
	const [verified, setVerified] = useState<boolean>()
	const [viewImages, setViewImages] = useState<number>()
	const [currentImage, setCurrentImage] = useState(0)
	const [localVerify, setLocalVerify] = useState<boolean>()
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!product && pid) {
			Api.getProduct(+pid).then(setProduct)
			.catch(() => setProduct(null))
		}

		if (!commerce && id) {
			Api.getCommerce(id).then(data => setCommerce(data.data))
			.catch(() => setCommerce(null))
		}
	}, [])

	const handleVerify = (verify: boolean) => () => {
		if (!pid || !user || user === 'guest') return

		if (user.roles.includes('ROLE_ADMIN')) {
			return Api.verifyProductAdmin(pid, verify)
			.then(data => {
				setVerifyModal(false)
				setVerified(verify)
				setLocalVerify(data.data.verified)
			})
		}
		
		Api.verifyProduct(pid, verify)
		.then(() => {
			setVerifyModal(false)
			setVerified(verify)
		})
	}
	
	return (
		<div className={styles.product}>
			{product === undefined || commerce === undefined && <LoadingPage />}
			{product && commerce ?
				<>
					<AnimatePresence>
						{viewImages !== undefined && product.productImages && product.productImages.length > 0 &&
							<ImageVisualizer {...{viewImages, setViewImages}} images={product.productImages} />
						}
					</AnimatePresence>
					<AnimatePresence>
						{verifyModal &&
							<motion.div className={styles.confirmVerify} initial={{ backgroundColor: 'var(--pr-color-tp)' }} animate={{ backgroundColor: 'var(--pr-color-op)' }} exit={{ opacity: 0 }} onClick={() => setVerifyModal(false)}>
								<motion.div className={styles.modal} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={e => e.stopPropagation()}>
									<div className={styles.text}>
										<div className={styles.icon}>
											<PiSealQuestionBold />
										</div>
										<p>¿Existe realmente este producto?</p>
									</div>
									<div className={styles.actions}>
										{(product.userVerificationReport !== null && product.userVerificationReport && verified === undefined) || verified !== undefined && verified ?
											<Tippy content={'Ya votaste este producto como existente'}>
												<button className={styles.disabled}>Existe</button>
											</Tippy>
										:
											<button onClick={handleVerify(true)}>Existe</button>
										}
										{(product.userVerificationReport !== null && !product.userVerificationReport && verified === undefined) || verified !== undefined && !verified ?
											<Tippy content={'Ya votaste este producto como no existente'}>
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
					<Link to='/..' className={styles.back}>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.route}>
						<Link to={`~/commerce/${id}`} className={styles.name}>{commerce.name}</Link> &gt; <Link to={`~/commerce/${id}/products`}>Productos</Link> &gt; <span className={styles.name}>{product.name}</span>
					</div>
					<div className={styles.pic} onClick={() => product.productImages && setViewImages(currentImage)}>
						{product.productImages && product.productImages.length > 0 ?
							<img src={`/api/images/${product.productImages[currentImage]}`} alt="" />
						:
							<div className={styles.blankImg}>
								<div className={styles.icon}>
									<PiImageBroken />
								</div>
							</div>
						}
					</div>
					{product.productImages && product.productImages.length > 1 &&
						<div className={styles.images}>
							{product.productImages.map((uuid, i) => (
								<div className={styles.image} key={uuid} onClick={() => setCurrentImage(i)}>
									<img src={`/api/images/${uuid}`} alt="" />
								</div>
							))}
						</div>
					}
					<div className={styles.info}>
						<div className={styles.topInfo}>
							<div className={styles.brand}>
								{product.brand}
							</div>
							{user !== 'guest' &&
								<Link to='/report' className={styles.report}>
									<div className={styles.icon}>
										<PiFlagBannerBold />
									</div>
									Reportar
								</Link>
							}
						</div>
						<div className={styles.name}>
							{product.name}
							<Tippy content={localVerify !== undefined ? (localVerify ? 'Comercio verificado' : 'Comercio no verificado') : product.verified ? 'Comercio verificado' : 'Comercio no verificado'}>
								<div className={`${styles.icon} ${localVerify !== undefined ? (localVerify ? styles.verified : '') : product.verified ? styles.verified : ''}`}>
									{localVerify !== undefined ? (localVerify ?
										<PiSealCheckBold />
									:
										<PiSealBold />
									) : product.verified ?
										<PiSealCheckBold />
									:
										<PiSealBold />
									}
								</div>
							</Tippy>
						</div>
						<div className={styles.price}>
							${product.price}
						</div>
						<div className={styles.tags}>
							{product.aptFor.map(tag => (
								<Tippy content={parseTag[tag].text} key={tag}>
									<div className={styles.tag}>
									{parseTag[tag].icon}
								</div>
								</Tippy>
							))}
						</div>
						{user !== 'guest' &&
							<div className={styles.buttons}>
								{product.submittedByUser && user && !user.roles.includes('ROLE_ADMIN') ?
									<Tippy content='No puedes verificar tu propio producto'>
										<button className={styles.disabled}>
											<div className={styles.icon}><PiCheckBold /></div>
											Verificado
										</button>
									</Tippy>
								:
									<button onClick={() => setVerifyModal(true)}>
										<AnimatePresence initial={false} mode='popLayout'>
											<motion.div className={styles.icon} key={`${verified}`} initial={{ rotate: verified ? 360 : -360, scale: 1.5 }} animate={{ rotate: 0, scale: 1 }}>
												{product.userVerificationReport === null && verified === undefined ?
													<PiQuestionMarkBold />
												: verified === undefined ?
													(product.userVerificationReport ?
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
										{product.userVerificationReport !== null || verified !== undefined ? 'Verificado' : 'Verificar'}
									</button>
								}
								{!user || !user.roles.includes('ROLE_ADMIN') && user.userRank === 'bronze' ?
									<Tippy content='Debes ser de rango plata o superior para editar un producto'>
										<button className={styles.disabled}>
											<div className={styles.icon}><PiPencilBold /></div>
											Editar
										</button>
									</Tippy>
								:
									<button onClick={() => navigate('/edit')}>
										<div className={styles.icon}><PiPencilBold /></div>
										Editar
									</button>
								}
							</div>
						}
					</div>
				</>
			: commerce === null ?
				<NotFound icon='404' title='Comercio no encontrado' message='Verifica que la URL sea correcta o vuelve a buscar el comercio' buttonIcon='search' buttonText='Buscar' link='~/search' />
			: product === null &&
				<NotFound icon='404' title='Producto no encontrado' message='Verifica que la URL sea correcta o vuelve al comercio' buttonIcon='commerce' buttonText='Volver' link={`~/commerce/${id}`} />
			}
		</div>
	)
}

export default Product