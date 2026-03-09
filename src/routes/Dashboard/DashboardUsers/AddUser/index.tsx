import { useState, type FormEvent } from 'react'
import styles from './styles.module.scss'
import { PiAtBold, PiCaretLeftBold, PiKeyBold, PiUserBold } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import { Link } from 'wouter'

const AddUser = () => {
	const [passError, setPassError] = useState(false)
	
	const handleChange = () => {
		if (passError) setPassError(false)
	}
	
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
	}
	
	return (
		<div className={styles.addUser}>
			<Link to='/'>
				<div className={styles.icon}>
					<PiCaretLeftBold />
				</div>
				Atrás
			</Link>
			<h3>Añadir usuario</h3>
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
					Añadir
				</button>
			</form>
		</div>
	)
}

export default AddUser