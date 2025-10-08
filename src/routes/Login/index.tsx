import { PiSignInBold, PiUserBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { useAllStore } from '../../store/useAllStore'
import { useEffect } from 'react'
import { useLocation } from 'wouter'

const Login = () => {
	const user = useAllStore(state => state.user)
	const setUser = useAllStore(state => state.setUser)
	const [, navigate] = useLocation()
	
	useEffect(() => {
		if (user) navigate('/')
	}, [user])
	
	const guestLogin = () => {
		setUser('guest')
	}

	return (
		<div className={styles.login}>
			<div className={styles.logo}>
				<img src="/nutrilens_isotipo_color.png" alt="" />
			</div>
			<div className={styles.options}>
				<button disabled>
					<div className={styles.icon}>
						<PiSignInBold />
					</div>
					Iniciar sesión
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