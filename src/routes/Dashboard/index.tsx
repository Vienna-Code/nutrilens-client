import { Link } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Api from '../../utils/api'
import LoadingPage from '../../components/LoadingPage'

const Dashboard = () => {
	const [commercesCount, setCommercesCount] = useState<number>()
	const [productsCount, setProductsCount] = useState<number>()
	const [postsCount, setPostsCount] = useState<number>()
	const [commercesReportsCount, setCommercesReportsCount] = useState<number>()
	const [productsReportsCount, setProductsReportsCount] = useState<number>()
	const [usersCount, setUsersCount] = useState<number>()

	useEffect(() => {
		if (!commercesCount) Api.getCommercesStats().then(data => setCommercesCount(data.total))
		if (!productsCount) Api.getProductsStats().then(data => setProductsCount(data.total))
		if (!postsCount) Api.getPostsStats().then(data => setPostsCount(data.total))
		if (!commercesReportsCount) Api.getReportsStats().then(data => {
			setCommercesReportsCount(data.commerce)
			setProductsReportsCount(data.product)
		})
		if (!usersCount) Api.getUsersStats().then(data => setUsersCount(data.total))
	}, [])

	return (
		<div className={styles.dashboard}>
			{commercesCount === undefined || productsCount === undefined || postsCount === undefined || commercesReportsCount === undefined || productsReportsCount === undefined || usersCount === undefined ? <LoadingPage />
			:
				<>
					<Link to='~/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<h2>Panel de control</h2>
					<div className={styles.options}>
						<div className={styles.reports}>
							<div className={styles.count}>
								{commercesReportsCount}
							</div>
							<Link to='/commercesReports'>reportes de comercios</Link>
						</div>
						<div className={styles.reports}>
							<div className={styles.count}>
								{productsReportsCount}
							</div>
							<Link to='/productsReports'>reportes de productos</Link>
						</div>
						<div className={styles.commerces}>
							<div className={styles.count}>
								{commercesCount}
							</div>
							<Link to='/commerces'>comercios</Link>
						</div>
						<div className={styles.products}>
							<div className={styles.count}>
								{productsCount}
							</div>
							<Link to='/products'>productos</Link>
						</div>
						<div className={styles.posts}>
							<div className={styles.count}>
								{postsCount}
							</div>
							<Link to='/posts'>posts</Link>
						</div>
					</div>
				</>
			}
		</div>
	)
}

export default Dashboard