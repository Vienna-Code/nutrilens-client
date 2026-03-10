import { Link, useLocation } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiPencilBold } from 'react-icons/pi'
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
	
	return (
		<div className={styles.dashboardUsers}>
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