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
				<Route path={'/login'} component={Login} nest />
				<Route path={'/search'} component={Search} />
				<Route path={'/commerce/:id'} component={Commerce} />
			</Switch>
		</div>
	)
}

export default App
