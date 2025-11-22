import { useState, type FormEvent } from 'react'
import styles from './styles.module.scss'
import { Link } from 'wouter'
import { PiAtBold, PiCaretLeftBold, PiKeyBold, PiUserBold } from 'react-icons/pi'
import Api from '../../../utils/api'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { useAllStore } from '../../../store/useAllStore'

const SignUp = () => {
	const [passError, setPassError] = useState(false)
	const setUser = useAllStore(state => state.setUser)
	
	const handleChange = () => {
		if (passError) setPassError(false)
	}
	
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { username, email, password, confirmPassword } = e.currentTarget

		if (password.value !== confirmPassword.value) return setPassError(true)
		
		Api.signUp(username.value, email.value, password.value)
		.then(data => {
			setUser(data.data)
		})
	}
	
	return (
		<div className={styles.signUp}>
			<span>
				<Link to='/'>
					<div className={styles.icon}>
						<PiCaretLeftBold />
					</div>
					Volver
				</Link>
			</span>
			<h2>Crear una cuenta</h2>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<div className={styles.input}>
						<input type="text" placeholder='Nombre de usuario' name='username' required autoComplete='username' />
						<div className={styles.icon}>
							<PiUserBold />
						</div>
					</div>
					<div className={styles.input}>
						<input type="email" placeholder='Correo electrónico' name='email' required autoComplete='username' />
						<div className={styles.icon}>
							<PiAtBold />
						</div>
					</div>
					<Tippy content='Las contraseñas no coinciden' visible={passError} placement='top-start' arrow={true} inertia={true} animation='scale'>
						<div className={styles.input}>
							<input className={passError ? styles.error : ''} type="password" placeholder='Contraseña' name='password' required autoComplete='new-password' onChange={handleChange} />
							<div className={styles.icon}>
								<PiKeyBold />
							</div>
						</div>
					</Tippy>
					<div className={styles.input}>
						<input className={passError ? styles.error : ''} type="password" placeholder='Confirmar contraseña' name='confirmPassword' required autoComplete='new-password' onChange={handleChange} />
						<div className={styles.icon}>
							<PiKeyBold />
						</div>
					</div>
				</fieldset>
				<button type='submit'>
					Registrarse
				</button>
			</form>
			<span>¿Ya tienes una cuenta? <Link to='/signIn'>Inicia sesión</Link></span>
		</div>
	)
}

export default SignUp