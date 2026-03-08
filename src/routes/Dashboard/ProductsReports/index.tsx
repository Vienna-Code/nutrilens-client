import { Link } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiImagesSquareBold } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'

const ProductsReports = () => {
	const [reports, setReports] = useState<ProductReport[]>()

	useEffect(() => {
		if (!reports) Api.getProductsReports(['issue']).then(setReports)
	}, [])
	
	return (
		<div className={styles.productsReports}>
			{!reports ? <LoadingPage />
			: reports.length > 0 ?
				<>
					<Link to='~/dashboard'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.reports}>
						{reports.map(({ id, content, image, product: { name } }) => (
							<div className={styles.report} key={id}>
								<Link to={`/${id}`} className={styles.title}>
									{name}
								</Link>
								<div className={styles.content}>
									{content}
								</div>
								{image &&
									<div className={styles.attachments}>
										<div className={styles.icon}>
											<PiImagesSquareBold />
										</div>
										1 imagen adjunta
									</div>
								}
							</div>
						))}
					</div>
				</>
			: <NotFound icon='report' title='No se encontraron reportes' message='' back='~/dashboard' />
		}
		</div>
	)
}

export default ProductsReports