import { PiNotePencilBold, PiSignInBold, PiUserBold } from 'react-icons/pi'
import { useAllStore } from '../../store/useAllStore'
import { useLocation } from 'wouter'
import styles from './styles.module.scss'
import { useEffect } from 'react'

const Login = () => {
	const user = useAllStore(state => state.user)
	const setUser = useAllStore(state => state.setUser)
	const [, navigate] = useLocation()
	
	const guestLogin = () => {
		setUser('guest')
	}

	useEffect(() => {
		if (user) navigate('~/')
	}, [user])

	return (
		<div className={styles.login}>
			<div className={styles.logo}>
				<img src="/nutrilens_logo_color.png" alt="" />
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
		</div>
	)
}

export default Login