import { Link, useLocation } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Api from '../../utils/api'
import LoadingPage from '../../components/LoadingPage'

const Dashboard = () => {
	const [commerces, setCommerces] = useState<Commerce[]>()
	const [products, setProducts] = useState<Product[]>()
	const [postsCount, setPostsCount] = useState<number>()
	// const [commerceReports, setCommerceReports] = useState<GetReport[]>()
	// const [productReports, setProductReports] = useState<GetReport[]>()
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!commerces) Api.getCommerces().then(data => setCommerces(data.data))
		if (!products) Api.getSearchProducts({}).then(setProducts)
		if (!postsCount) Api.getPostsStats().then(data => setPostsCount(data.data.total))
		// if (!commerceReports) Api.getCommerceReports().then(setCommerceReports)
		// if (!productReports) Api.getProductReports().then(setProductReports)
	}, [])

	return (
		<div className={styles.dashboard}>
			{!commerces || !products || !postsCount ? <LoadingPage />
			:
				<>
					<Link to='~/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Volver
					</Link>
					<h2>Panel de control</h2>
					<div className={styles.options}>
						<div className={styles.reports}>
							
						</div>
						<div className={styles.commerces}>
							<div className={styles.count}>
								{commerces.length}
								<span>comercios</span>
							</div>
							<button onClick={() => navigate('/commerces')}>Ver todos</button>
						</div>
						<div className={styles.products}>
							<div className={styles.count}>
								{products.length}
								<span>productos</span>
							</div>
							<button onClick={() => navigate('/products')}>Ver todos</button>
						</div>
						<div className={styles.posts}>
							<div className={styles.count}>
								{postsCount}
								<span>posts</span>
							</div>
							<button onClick={() => navigate('/posts')}>Ver todos</button>
						</div>
					</div>
				</>
			}
		</div>
	)
}

export default Dashboard