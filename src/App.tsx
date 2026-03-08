import { useEffect } from 'react'
import Home from './routes/Home'
import Login from './routes/Login'
import styles from './styles.module.scss'
import { Route, Switch, useLocation } from 'wouter'
import { useAllStore } from './store/useAllStore'
import Search from './routes/Search'
import Api from './utils/api'
import LoadingPage from './components/LoadingPage'
import Commerce from './routes/Commerce'
import AddCommerce from './routes/AddCommerce'
import SignIn from './routes/Login/SignIn'
import SignUp from './routes/Login/SignUp'
import AddReview from './routes/Commerce/AddReview'
import Products from './routes/Commerce/Products'
import Product from './routes/Commerce/Products/Product'
import Profile from './routes/Profile'
import Community from './routes/Community'
import Post from './routes/Community/Post'
import AddPost from './routes/Community/AddPost'
import AddProduct from './routes/Commerce/Products/AddProduct'
import EditReview from './routes/Commerce/EditReview'
import ReportProduct from './routes/Commerce/Products/Product/ReportProduct'
import EditProduct from './routes/Commerce/Products/Product/EditProduct'
import EditPost from './routes/Community/Post/EditPost'
import EditCommerce from './routes/Commerce/EditCommerce'
import ReportCommerce from './routes/Commerce/ReportCommerce'
import Dashboard from './routes/Dashboard'
import ProfileCommerces from './routes/Profile/ProfileCommerces'
import ProfileProducts from './routes/Profile/ProfileProducts'
import ProfilePosts from './routes/Profile/ProfilePosts'
import ProfileReviews from './routes/Profile/ProfileReviews'
import CommercesReports from './routes/Dashboard/CommercesReports'
import ProductsReports from './routes/Dashboard/ProductsReports'
import DashboardCommerces from './routes/Dashboard/DashboardCommerces'

const App = () => {
	const user = useAllStore(state => state.user)
	const setUser = useAllStore(state => state.setUser)
	const [, navigate] = useLocation()
	
	useEffect(() => {
		if (user === undefined) {
			Api.getUser()
			.then(user => {
				setUser(user)
				return
			}).catch(() => {
				setUser(null)
			})
		}

		if (user === null) {
			return navigate('/login')
		}
	}, [user])
	
	if (user === undefined) return <LoadingPage />
	
	return (
		<div className={styles.main}>
			<Switch>
				<Route path={'/'} component={Home} />
				<Route path={'/login'} nest>
					<Route path={'/'} component={Login} />
					<Route path={'/signin'} component={SignIn} />
					<Route path={'/signup'} component={SignUp} />
				</Route>
				<Route path={'/search'} component={Search} />
				<Route path={'/commerce/:id'} nest>
					<Route path={'/'} component={Commerce} />
					<Route path={'/edit'} component={EditCommerce} />
					<Route path={'/report'} component={ReportCommerce} />
					<Route path={'/addReview'} component={AddReview} />
					<Route path={'/editReview'} component={EditReview} />
					<Route path={'/products'} nest>
						<Switch>
							<Route path={'/'} component={Products} />
							<Route path={'/add'} component={AddProduct} />
							<Route path={'/:pid'} nest>
								<Switch>
									<Route path={'/'} component={Product} />
									<Route path={'/edit'} component={EditProduct} />
									<Route path={'/report'} component={ReportProduct} />
								</Switch>
							</Route>
						</Switch>
					</Route>
				</Route>
				<Route path={'/add'} component={AddCommerce} />
				<Route path={'/profile'} nest>
					<Switch>
						<Route path={'/'} component={Profile} />
						<Route path={'/commerces'} component={ProfileCommerces} />
						<Route path={'/products'} component={ProfileProducts} />
						<Route path={'/reviews'} component={ProfileReviews} />
						<Route path={'/posts'} component={ProfilePosts} />
					</Switch>
				</Route>
				<Route path={'/community'} nest>
					<Switch>
						<Route path={'/'} component={Community} />
						<Route path={'/add'} component={AddPost} />
						<Route path={'/:id'} nest>
							<Switch>
								<Route path={'/'} component={Post} />
								<Route path={'/edit'} component={EditPost} />
							</Switch>
						</Route>
					</Switch>
				</Route>
				<Route path={'/dashboard'} nest>
					<Switch>
						<Route path={'/'} component={Dashboard} />
						<Route path={'/commercesReports'} nest>
							<Switch>
								<Route path={'/'} component={CommercesReports} />
								<Route path={'/:id'} component={CommercesReports} />
							</Switch>
						</Route>
						<Route path={'/productsReports'} nest>
							<Switch>
								<Route path={'/'} component={ProductsReports} />
								<Route path={'/:id'} component={ProductsReports} />
							</Switch>
						</Route>
						<Route path={'/commerces'} component={DashboardCommerces} />
					</Switch>
				</Route>
			</Switch>
		</div>
	)
}

export default App
