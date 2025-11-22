import { useState, type FormEvent } from 'react'
import styles from './styles.module.scss'
import { Link } from 'wouter'
import { PiCaretLeftBold, PiKeyBold, PiUserBold } from 'react-icons/pi'
import Api from '../../../utils/api'
import 'tippy.js/dist/tippy.css'
import Tippy from '@tippyjs/react'
import { useAllStore } from '../../../store/useAllStore'

const SignIn = () => {
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const setUser = useAllStore(state => state.setUser)
	
	const handleChange = () => {
		if (error) setError(false)
	}
	
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { username, password } = e.currentTarget

		Api.logIn(username.value, password.value)
		.then(data => {
			setUser(data.data)
		}).catch(err => {
			setError(true)
			setErrorMessage(err.message)
		})
	}
	
	return (
		<div className={styles.signIn}>
			<span>
				<Link to='/'>
					<div className={styles.icon}>
						<PiCaretLeftBold />
					</div>
					Volver
				</Link>
			</span>
			<h2>¡Bienvenid@ de vuelta!</h2>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<Tippy content={errorMessage} visible={error} placement='top-start' arrow={true} inertia={true} animation='scale'>
						<div className={styles.input}>
							<input className={error ? styles.error : ''} type="text" placeholder='Nombre de usuario' name='username' required autoComplete='username' onChange={handleChange} />
							<div className={styles.icon}>
								<PiUserBold />
							</div>
						</div>
					</Tippy>
					<div className={styles.input}>
						<input className={error ? styles.error : ''} type="password" placeholder='Contraseña' name='password' required autoComplete='current-password' onChange={handleChange} />
						<div className={styles.icon}>
							<PiKeyBold />
						</div>
					</div>
				</fieldset>
				<button type='submit'>
					Iniciar sesión
				</button>
			</form>
			<span>¿Aún no tienes una cuenta? <Link to='/signup'>Regístrate</Link></span>
		</div>
	)
}

export default SignIn