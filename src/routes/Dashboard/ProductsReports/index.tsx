import { Link } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiCheckBold, PiImagesSquareBold, PiXBold } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'
import ImageVisualizer from '../../../components/ImageVisualizer'
import { AnimatePresence } from 'framer-motion'

const CommercesReports = () => {
	const [reports, setReports] = useState<ProductReport[]>()
	const [images, setImages] = useState<string[]>()
	const [viewImages, setViewImages] = useState<number|undefined>()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!reports) Api.getProductsReports(['issue']).then(setReports)
	}, [])

	const handleImage = (image: string) => () => {
		setImages(() => [image])
		setViewImages(0)
	}

	const handleAction = (rid: number, pid: number, action: boolean) => () => {
		setLoading(true)
		
		Api.editProductReport(rid, pid, action)
		.then(() => {
			Api.getProductsReports(['issue']).then(data => {
				setReports(data)
				setLoading(false)
			})
		})
	}

	return (
		<div className={styles.productsReports}>
			{loading && <LoadingPage absolute />}
			{!reports ? <LoadingPage />
			: reports.length > 0 ?
				<>
					<AnimatePresence>
						{viewImages !== undefined && images && <ImageVisualizer viewImages={viewImages} images={images} setViewImages={setViewImages} />}
					</AnimatePresence>
					<Link to='~/dashboard'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.reports}>
						{reports.map(({ id, content, image, product: { name, id: pid, commerce: { id: cid } }, user: { username } }) => (
							<div className={styles.report} key={id}>
								<Link to={`~/commerce/${cid}/products/${pid}`} className={styles.title}>
									{name}
								</Link>
								<div className={styles.username}>
									{username}
								</div>
								<div className={styles.content}>
									{content}
								</div>
								{image &&
									<div className={styles.attachments} onClick={handleImage(image)}>
										<div className={styles.icon}>
											<PiImagesSquareBold />
										</div>
										1 imagen adjunta
									</div>
								}
								<div className={styles.actions}>
									<button onClick={handleAction(id, pid, true)}>
										<div className={styles.icon}>
											<PiCheckBold />
										</div>
										Aprobar
									</button>
									<button onClick={handleAction(id, pid, false)}>
										<div className={styles.icon}>
											<PiXBold />
										</div>
										Rechazar
									</button>
								</div>
							</div>
						))}
					</div>
				</>
			: <NotFound icon='report' title='No se encontraron reportes' message='' back='~/dashboard' />
		}
		</div>
	)
}

export default CommercesReports