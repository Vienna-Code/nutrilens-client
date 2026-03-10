import { useState, type FormEvent } from 'react'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiCheckFatBold, PiUserBold, PiUserGearBold } from 'react-icons/pi'
import { Link, useLocation } from 'wouter'
import { motion } from 'framer-motion'
import Api from '../../../../utils/api'
import LoadingPage from '../../../../components/LoadingPage'

const AddUser = () => {
	const [type, setType] = useState(false)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(8)
	const [, navigate] = useLocation()
	
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { username, email, password, type } = e.currentTarget

		const newUser: NewUser = {
			username: username.value.trim(),
			email: email.value.trim(),
			password: password.value.trim(),
			roles: type.value === 'ROLE_ADMIN' ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER']
		}

		setLoading(true)
		
		Api.addUser(newUser)
		.then(() => {
			setSuccess(true)
			
			setInterval(() => {
				setSuccessCounter(prev => prev - 1)
			}, 1000)
		}).catch(() => {
			setLoading(false)
		})
	}
	
	return (
		<div className={styles.addUser}>
			{success &&
				<div className={styles.success}>
					<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
						<PiCheckFatBold />
					</motion.div>
					<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
						¡Usuario editado con éxito!
					</motion.div>
					<motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }} onClick={() => navigate('/')}>Volver a los usuarios ({successCounter})</motion.button>
				</div>
			}
			{loading && <LoadingPage absolute />}
			<Link to='/'>
				<div className={styles.icon}>
					<PiCaretLeftBold />
				</div>
				Atrás
			</Link>
			<h3>Añadir usuario</h3>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="username">Nombre de usuario *</label>
					<input type='text' placeholder='' id='username' name='username' required autoComplete='username'/>
				</fieldset>
				<fieldset>
					<label htmlFor="email">Correo electrónico *</label>
					<input type='text' placeholder='' id='email' name='email' required autoComplete='username'/>
				</fieldset>
				<fieldset>
					<label htmlFor="password">Contraseña *</label>
					<input type='password' placeholder='' id='password' name='password' required autoComplete='new-password'/>
				</fieldset>
				<fieldset className={styles.mixed}>
					<span className={styles.title}>Tipo de usuario *</span>
					<div className={styles.options}>
						<div className={styles.option}>
							<label htmlFor="user">
								<div className={styles.icon}>
									<PiUserBold />
								</div>
								Común
							</label>
							<input type="radio" value='ROLE_USER' name='type' id='user' defaultChecked={!type} onChange={e => e.currentTarget.checked && setType(false)} />
							{!type && <motion.div layoutId='bg' className={styles.bg}></motion.div>}
						</div>
						<div className={styles.option}>
							<label htmlFor="admin">
								<div className={styles.icon}>
									<PiUserGearBold />
								</div>
								Admin
							</label>
							<input type="radio" value='ROLE_ADMIN' name='type' id='admin' onChange={e => e.currentTarget.checked && setType(true)} defaultChecked={type} />
							{type && <motion.div layoutId='bg' className={styles.bg}></motion.div>}
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