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
	const [product, setProduct] = useState<Product>()
	const [commerce, setCommerce] = useState<Commerce>()
	const [verifyModal, setVerifyModal] = useState(false)
	const [verified, setVerified] = useState<boolean>()
	const [viewImages, setViewImages] = useState<number>()
	const [currentImage, setCurrentImage] = useState(0)
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!product && pid) {
			Api.getProduct(+pid).then(setProduct)
		}

		if (!commerce && id) {
			Api.getCommerce(id).then(data => setCommerce(data.data))
		}
	}, [])

	const handleVerify = (verify: boolean) => () => {
		if (!pid) return
		
		Api.verifyProduct(pid, verify)
		.then(() => {
			setVerifyModal(false)
			setVerified(verify)
		})
	}
	
	return (
		<div className={styles.product}>
			{!product || !commerce && <LoadingPage />}
			{product && commerce &&
				<>
					<AnimatePresence>
						{viewImages !== undefined && product.productImages &&
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
						{product.productImages ?
							<img src={`${import.meta.env.VITE_API_URL as string}/images/${product.productImages[currentImage]}`} alt="" />
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
									<img src={`${import.meta.env.VITE_API_URL as string}/images/${uuid}`} alt="" />
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
									Reportar
									<div className={styles.icon}>
										<PiFlagBannerBold />
									</div>
								</Link>
							}
						</div>
						<div className={styles.name}>
							{product.name}
							<Tippy content={product.verified ? 'Producto verificado' : 'Producto no verificado'}>
								<div className={`${styles.icon} ${product.verified ? styles.verified : ''}`}>
									{product.verified ?
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
								{product.submittedByUser ?
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
								<button onClick={() => navigate('/edit')}>
									<div className={styles.icon}><PiPencilBold /></div>
									Editar
								</button>
							</div>
						}
					</div>
				</>
			}
		</div>
	)
}

export default Product