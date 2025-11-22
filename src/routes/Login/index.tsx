import { PiNotePencilBold, PiSignInBold, PiUserBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { useAllStore } from '../../store/useAllStore'
import { useEffect } from 'react'
import { useLocation, Route, Switch } from 'wouter'
import SignIn from './SignIn'
import SignUp from './SignUp'

const Login = () => {
	const user = useAllStore(state => state.user)
	const setUser = useAllStore(state => state.setUser)
	const [, navigate] = useLocation()
	
	useEffect(() => {
		if (user) navigate('~/')
	}, [user])
	
	const guestLogin = () => {
		setUser('guest')
	}

	return (
		<div className={styles.login}>
			<Switch>
				<Route path="/">
					<div className={styles.logo}>
						<img src="/nutrilens_isotipo_color.png" alt="" />
					</div>
					<div className={styles.options}>
						<button onClick={() => navigate('/signin')}>
							<div className={styles.icon}>
								<PiSignInBold />
							</div>
							Iniciar sesión
						</button>
						<button onClick={() => navigate('/signup')}>
							<div className={styles.icon}>
								<PiNotePencilBold />
							</div>
							Registrarse
						</button>
						<button onClick={guestLogin}>
							<div className={styles.icon}>
								<PiUserBold />
							</div>
							Entrar como invitado
						</button>
					</div>
				</Route>
				<Route path="/signin" component={SignIn} />
				<Route path="/signup" component={SignUp} />
			</Switch>
		</div>
	)
}

export default Login