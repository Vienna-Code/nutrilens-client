import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import { Link } from 'wouter'
import NotFound from '../../../components/NotFound'
import { PiCaretLeftBold, PiThumbsDownBold, PiThumbsUpBold } from 'react-icons/pi'

const ProfileReviews = () => {
	const [reviews, setReviews] = useState<UserReview[]>()

	useEffect(() => {
		if (reviews === undefined) Api.getUserReviews().then(setReviews)
	}, [])
	
	return (
		<div className={styles.profileReviews}>
			{reviews === undefined ? <LoadingPage />
			: reviews.length > 0 ?
				<>
					<Link to='/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<h3>Reseñas creadas</h3>
					<div className={styles.list}>
						{reviews.map(({ id, content, positive, commerce: { id: cid, name } }) => (
							<div className={styles.review} key={id}>
								<Link to={`~/commerce/${cid}/editReview`} className={styles.title}>
									{name}
								</Link>
								<div className={styles.info}>
									<div className={styles.rate}>
										<div className={styles.icon}>
											{positive ? <PiThumbsUpBold /> : <PiThumbsDownBold />}
										</div>
										{positive ? 'Recomendado' : 'No recomendado'}
									</div>
									<div className={styles.content}>
										{content.substring(0, 75)}...
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			: <NotFound icon='review' title='No se encontraron reseñas' message='No has creado ninguna reseña aún. Busca un comercio para añadir una' buttonIcon='search' buttonText='Buscar' link='~/search' back='/' />
			}
		</div>
	)
}

export default ProfileReviews