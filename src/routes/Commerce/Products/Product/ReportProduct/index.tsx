import { Link, useLocation, useParams } from 'wouter'
import styles from './styles.module.scss'
import { useEffect, useState, type FormEvent } from 'react'
import Api from '../../../../../utils/api'
import LoadingPage from '../../../../../components/LoadingPage'
import { PiCaretLeftBold, PiCheckFatBold } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import DropImage from '../../../../../components/DropImage'
import { motion } from 'framer-motion'

const ReportProduct = () => {
	const { pid } = useParams()
	const [, navigate] = useLocation()
	const [product, setProduct] = useState<Product>()
	const [images, setImages] = useState<Images<File>>([])
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(8)
	const [error, setError] = useState({ field: '', message: '' })

	useEffect(() => {
		if (pid && !product) {
			Api.getProduct(+pid).then(setProduct)
		}
	}, [pid])

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { content } = e.currentTarget

		if (!pid) return

		const uuids = images.length > 0 ? await Api.uploadImages(images.map(x => x.image)).then(uuids => uuids[0]) : undefined

		const newReport = {
			content: content.value,
			image: uuids
		}

		setLoading(true)

		Api.reportCommerce(pid, newReport)
		.then(() => {
			setSuccess(true)

			setInterval(() => {
				setSuccessCounter(prev => prev - 1)
			}, 1000)
		}).catch(() => {
			setLoading(false)
		})
	}

	useEffect(() => {
		if (successCounter === 0) navigate('/')
	}, [successCounter])
	
	return (
		<div className={styles.reportProduct}>
			{success &&
				<div className={styles.success}>
					<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
						<PiCheckFatBold />
					</motion.div>
					<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
						¡Reporte enviado con éxito!
					</motion.div>
					<motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }} onClick={() => navigate('/')}>Volver al producto ({successCounter})</motion.button>
				</div>
			}
			{product === undefined || loading ? <LoadingPage absolute />
			:
				<>
					<Link to='/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Volver
					</Link>
					<div className={styles.title}>
						<h2>Reportar producto</h2>
						<span>{product.name}, {product.brand}</span>
					</div>
					<form onSubmit={handleSubmit}>
						<Tippy content={error.message} visible={error.field === 'content'}>
							<fieldset>
								<label htmlFor="content">Contenido del reporte... *</label>
								<textarea id='content' name='content' placeholder='' required onChange={() => error.field && setError(() => ({ field: '', message: '' }))}></textarea>
							</fieldset>
						</Tippy>
						<Tippy content={error.message} visible={error.field === 'images'}>
							<DropImage<File> images={images} setImages={setImages} square={false} type='reporte' label='Imágenes' alt limit={1} />
						</Tippy>
						<button type='submit'>Reportar</button>
					</form>
				</>
			}
		</div>
	)
}

export default ReportProduct