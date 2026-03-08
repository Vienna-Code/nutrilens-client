import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import { Link } from 'wouter'
import NotFound from '../../../components/NotFound'
import { PiCaretLeftBold, PiImagesSquareBold } from 'react-icons/pi'

const ProfilePosts = () => {
	const [posts, setPosts] = useState<Post[]>()

	useEffect(() => {
		if (posts === undefined) Api.getUserPosts().then(setPosts)
	}, [])
	
	return (
		<div className={styles.profilePosts}>
			{posts === undefined ? <LoadingPage />
			: posts.length > 0 ?
				<>
					<Link to='/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<h3>Posts realizados</h3>
					<div className={styles.list}>
						{posts.map(({ id, title, content, attachments }) => (
							<div className={styles.post} key={id}>
								<Link to={`~/community/${id}`} className={styles.title}>
									{title}
								</Link>
								<div className={styles.info}>
									<div className={styles.content}>
										{content}
									</div>
									{attachments &&
										<div className={styles.attachments}>
											<div className={styles.icon}>
												<PiImagesSquareBold />
											</div>
											{attachments.length} imágenes adjuntas
										</div>
									}
								</div>
							</div>
						))}
					</div>
				</>
			: <NotFound icon='post' title='No se encontraron posts' message='No has subido ningún post aún. Crea uno en la sección de comunidad' buttonIcon='post' buttonText='Comunidad' link='~/community' back='/' />
			}
		</div>
	)
}

export default ProfilePosts