import { Link, useLocation } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiChatCircleBold, PiImagesSquareBold, PiPencilBold, PiTrashBold, PiWarningBold } from 'react-icons/pi'
import { useEffect, useState, type ChangeEvent } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'
import { AnimatePresence, motion } from 'framer-motion'

const DashboardPosts = () => {
	const [posts, setPosts] = useState<Post[]>()
	const [search, setSearch] = useState('')
	const [deleteModal, setDeleteModal] = useState<{ id: number, title: string, content: string }>()
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!posts) Api.getPosts(null).then(setPosts)
	}, [])

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget
		setSearch(value)
	}

	const handleDelete = () => {
		if (!deleteModal) return
		
		const { id } = deleteModal

		Api.deletePost(`${id}`)
		.then(() => {
			Api.getPosts(null)
			.then(data => {
				setPosts(data)
				setDeleteModal(undefined)
			})
		})
	}
	
	return (
		<div className={styles.dashboardPosts}>
			<AnimatePresence>
				{deleteModal &&
					<motion.div className={styles.deleteModalWrapper} initial={{ backgroundColor: 'var(--pr-color-tp)' }} animate={{ backgroundColor: 'var(--pr-color-op)' }} exit={{ opacity: 0 }} onClick={() => setDeleteModal(undefined)}>
						<motion.div className={styles.deleteModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={e => e.stopPropagation()}>
							<div className={styles.message}>
								<div className={styles.icon}>
									<PiWarningBold />
								</div>
								<p>¿Realmente desea eliminar este post?</p>
							</div>
							<motion.div layoutId={`${deleteModal.id}`} className={styles.product}>
								<div className={styles.title}>
									{deleteModal.title}
								</div>
								<div className={styles.content}>
									{deleteModal.content.length > 80 ? `${deleteModal.content.substring(80)}...` : deleteModal.content}
								</div>
							</motion.div>
							<div className={styles.actions}>
								<button onClick={() => setDeleteModal(undefined)}>No</button>
								<button onClick={handleDelete}>Sí</button>
							</div>
						</motion.div>
					</motion.div>
				}
			</AnimatePresence>
			{!posts ? <LoadingPage />
			:
				<>
					<Link to='~/dashboard'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.search}>
						<input type="text" placeholder='Buscar posts...' onChange={handleSearch} />
					</div>
					{posts.length > 0 ?
						<div className={styles.posts}>
							<AnimatePresence>
								{posts.filter(x => search ? x.title.toLowerCase().includes(search.toLowerCase()) : x).map(({ id, title, content, attachments, totalComments }) => (
									<motion.div className={styles.post} key={id} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} layoutId={`${id}`}>
										<Link to={`~/community/${id}`} className={styles.title}>
											{title}
										</Link>
										<div className={styles.content}>
											{content.length > 80 ? `${content.substring(80)}...` : content}
										</div>
										{attachments &&
											<div className={styles.attachments}>
												<div className={styles.icon}>
													<PiImagesSquareBold />
												</div>
												{attachments.length} {attachments.length > 1 ? 'imágenes adjuntas' : 'imagen adjunta'}
											</div>
										}
										{totalComments > 0 &&
											<div className={styles.comments}>
												<div className={styles.icon}>
													<PiChatCircleBold />
												</div>
												{totalComments} {totalComments > 1 ? 'comentarios' : 'comentario'}
											</div>
										}
										<div className={styles.actions}>
											<button onClick={() => navigate(`~/community/${id}/edit`)}>
												<div className={styles.icon}>
													<PiPencilBold />
												</div>
												Editar
											</button>
											<button onClick={() => setDeleteModal(() => ({ id, title, content }))}>
												<div className={styles.icon}>
													<PiTrashBold />
												</div>
												Eliminar
											</button>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					: <NotFound icon='post' title='No se encontraron posts' message='' />}
				</>
		}
		</div>
	)
}

export default DashboardPosts