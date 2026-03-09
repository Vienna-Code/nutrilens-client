import { Link, useLocation } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiImagesSquareBold, PiPencilBold, PiTrashBold, PiWarningBold } from 'react-icons/pi'
import { useEffect, useState, type ChangeEvent } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'
import { AnimatePresence, motion } from 'framer-motion'
import LoadingChild from '../../../components/LoadingChild'

const DashboardProducts = () => {
	const [products, setProducts] = useState<Product[]>()
	const [search, setSearch] = useState('')
	const [loadingSearch, setLoadingSearch] = useState(false)
	const [deleteModal, setDeleteModal] = useState<{ id: number, name: string, cname: string }>()
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!products) Api.getSearchProducts().then(setProducts)
	}, [])

	const searchWithOptions = (value: string) => {
		Api.getSearchProducts({
			name: value || undefined,
		}).then(data => {
			setProducts(data)
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
			Api.getSearchProducts({
				name: search || undefined
			}).then(data => {
				setProducts(data)
				setDeleteModal(undefined)
			})
		})
	}
	
	return (
		<div className={styles.dashboardProducts}>
			<AnimatePresence>
				{deleteModal &&
					<motion.div className={styles.deleteModalWrapper} initial={{ backgroundColor: 'var(--pr-color-tp)' }} animate={{ backgroundColor: 'var(--pr-color-op)' }} exit={{ opacity: 0 }} onClick={() => setDeleteModal(undefined)}>
						<motion.div className={styles.deleteModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={e => e.stopPropagation()}>
							<div className={styles.message}>
								<div className={styles.icon}>
									<PiWarningBold />
								</div>
								<p>¿Realmente desea eliminar este producto?</p>
							</div>
							<motion.div layoutId={`${deleteModal.id}`} className={styles.product}>
								<div className={styles.title}>
									{deleteModal.name}
								</div>
								<div className={styles.content}>
									{deleteModal.cname}
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
			{!products ? <LoadingPage />
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
					{products.length > 0 ?
						<div className={styles.products}>
							<AnimatePresence>
								{products.map(({ id, name, commerce: { id: cid, name: cname }, productImages }) => (
									<motion.div className={styles.product} key={id} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} layoutId={`${id}`}>
										<Link to={`~/commerce/${cid}/products/${id}`} className={styles.title}>
											{name}
										</Link>
										<div className={styles.content}>
											{cname}
										</div>
										{productImages &&
											<div className={styles.attachments}>
												<div className={styles.icon}>
													<PiImagesSquareBold />
												</div>
												{productImages.length} {productImages.length > 1 ? 'imágenes adjuntas' : 'imagen adjunta'}
											</div>
										}
										<div className={styles.actions}>
											<button onClick={() => navigate(`~/commerce/${cid}/products/${id}/edit`)}>
												<div className={styles.icon}>
													<PiPencilBold />
												</div>
												Editar
											</button>
											<button onClick={() => setDeleteModal(() => ({ id, name, cname }))}>
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
					: <NotFound icon='product' title='No se encontraron productos' message='' />}
				</>
		}
		</div>
	)
}

export default DashboardProducts