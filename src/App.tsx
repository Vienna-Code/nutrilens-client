import { useEffect } from 'react'
import Home from './routes/Home'
import Login from './routes/Login'
import styles from './styles.module.scss'
import { Route, Switch, useLocation } from 'wouter'
import { useAllStore } from './store/useAllStore'
import Search from './routes/Search'
import Location from './routes/Location'

const App = () => {
	const user = useAllStore(state => state.user)
	const [, navigate] = useLocation()
	
	useEffect(() => {
		if (user === undefined) return navigate('/login')
	}, [user])
	
	return (
		<div className={styles.main}>
			<Switch>
				<Route path={'/'} component={Home} />
				<Route path={'/login'} component={Login} />
				<Route path={'/search'} component={Search} />
				<Route path={'/location/:id'} component={Location} />
			</Switch>
		</div>
	)
}

export default App
