import { Link } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiImagesSquareBold } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'

const DashboardCommerces = () => {
	const [commerces, setCommerces] = useState<Commerce[]>()

	useEffect(() => {
		if (!commerces) Api.getCommerces({ name: undefined }).then(data => setCommerces(data.data))
	}, [])
	
	return (
		<div className={styles.dashboardCommerces}>
			{!commerces ? <LoadingPage />
			: commerces.length > 0 ?
				<>
					<Link to='~/dashboard'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.commerces}>
						{commerces.map(({ id, name, address, commerceImages }) => (
							<div className={styles.commerce} key={id}>
								<Link to={`/${id}`} className={styles.title}>
									{name}
								</Link>
								<div className={styles.content}>
									{address}
								</div>
								{commerceImages &&
									<div className={styles.attachments}>
										<div className={styles.icon}>
											<PiImagesSquareBold />
										</div>
										{commerceImages.length} {commerceImages.length > 1 ? 'imágenes adjuntas' : 'imagen adjunta'}
									</div>
								}
							</div>
						))}
					</div>
				</>
			: <NotFound icon='map' title='No se encontraron comercios' message='' back='~/dashboard' />
		}
		</div>
	)
}

export default DashboardCommerces