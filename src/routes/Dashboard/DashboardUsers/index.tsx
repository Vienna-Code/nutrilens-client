import { Link, useLocation } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiPencilBold, PiTrashBold, PiWarningBold } from 'react-icons/pi'
import { useEffect, useState, type ChangeEvent } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'
import { AnimatePresence, motion } from 'framer-motion'
import LoadingChild from '../../../components/LoadingChild'

const DashboardUsers = () => {
	const [users, setUsers] = useState<RealUser[]>()
	const [search, setSearch] = useState('')
	const [loadingSearch, setLoadingSearch] = useState(false)
	const [deleteModal, setDeleteModal] = useState<{ id: number, username: string, email: string }>()
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!users) Api.getUsers().then(setUsers)
	}, [])

	const searchWithOptions = (value: string) => {
		Api.getUsers({
			username: value || undefined,
		}).then(data => {
			setUsers(data)
			setLoadingSearch(false)
		})
	}

	useEffect(() => {
		setLoadingSearch(true)
		
		const timer = setTimeout(() => {
			searchWithOptions(search)
		}, 1500)

		return () => {
			clearTimeout(timer)
			setLoadingSearch(false)
		}
	}, [search])

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget
		setSearch(value)
	}

	const handleDelete = () => {
		if (!deleteModal) return
		
		const { id } = deleteModal

		Api.deleteProduct(`${id}`)
		.then(() => {
			Api.getUsers({
				username: search || undefined
			}).then(data => {
				setUsers(data)
				setDeleteModal(undefined)
			})
		})
	}
	
	return (
		<div className={styles.dashboardUsers}>
			<AnimatePresence>
				{deleteModal &&
					<motion.div className={styles.deleteModalWrapper} initial={{ backgroundColor: 'var(--pr-color-tp)' }} animate={{ backgroundColor: 'var(--pr-color-op)' }} exit={{ opacity: 0 }} onClick={() => setDeleteModal(undefined)}>
						<motion.div className={styles.deleteModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={e => e.stopPropagation()}>
							<div className={styles.message}>
								<div className={styles.icon}>
									<PiWarningBold />
								</div>
								<p>¿Realmente desea eliminar este usuario?</p>
							</div>
							<motion.div layoutId={`${deleteModal.id}`} className={styles.user}>
								<div className={styles.title}>
									{deleteModal.username}
								</div>
								<div className={styles.content}>
									{deleteModal.email}
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
			{!users ? <LoadingPage />
			:
				<>
					<Link to='~/dashboard'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.search}>
						<input type="text" placeholder='Buscar productos...' onChange={handleSearch} />
						{loadingSearch &&
							<div className={styles.loading}>
								<LoadingChild />
							</div>
						}
					</div>
					{users.length > 0 ?
						<div className={styles.users}>
							<AnimatePresence>
								{users.map(({ id, username, email }) => (
									<motion.div className={styles.user} key={id} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} layoutId={`${id}`}>
										<div className={styles.title}>
											{username}
										</div>
										<div className={styles.content}>
											{email}
										</div>
										<div className={styles.actions}>
											<button onClick={() => navigate(`/${id}/edit`)}>
												<div className={styles.icon}>
													<PiPencilBold />
												</div>
												Editar
											</button>
											<button onClick={() => setDeleteModal(() => ({ id, username, email }))}>
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
					: <NotFound icon='users' title='No se encontraron usuarios' message='' />}
				</>
		}
		</div>
	)
}

export default DashboardUsers