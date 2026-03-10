import { useEffect, useState, type FormEvent } from 'react'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiCheckFatBold, PiUserBold, PiUserGearBold } from 'react-icons/pi'
import { Link, useLocation, useParams } from 'wouter'
import { motion } from 'framer-motion'
import Api from '../../../../utils/api'
import LoadingPage from '../../../../components/LoadingPage'
import NotFound from '../../../../components/NotFound'

const EditUser = () => {
	const { id } = useParams()
	const [user, setUser] = useState<RealUser|null>()
	const [type, setType] = useState(false)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(8)
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!id) return

		if (user === undefined) Api.getAdminUser(id).then(data => {
			setType(data.roles.includes('ROLE_ADMIN'))
			setUser(data)
		}).catch(() => setUser(null))
	}, [id])

	useEffect(() => {
		if (successCounter === 0) navigate('/')
	}, [successCounter])

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!user || !id) return

		const { username, email, password, type } = e.currentTarget

		const newUser: EditUserAdmin = {
			username: username.value.trim() !== user.username ? username.value.trim() : undefined,
			email: email.value.trim() !== user.email ? email.value.trim() : undefined,
			newPassword: password.value.trim() || undefined,
			roles: type.value === 'ROLE_ADMIN' ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER']
		}

		setLoading(true)
		
		Api.editAdminUser(id, newUser)
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
		<div className={styles.editUser}>
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
			{user === undefined ? <LoadingPage />
			: user ?
				<>
					<Link to='/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<h3>Editar usuario <span className={styles.username}>{user.username}</span></h3>
					<form onSubmit={handleSubmit}>
						<fieldset>
							<label htmlFor="username">Nombre de usuario</label>
							<input type='text' placeholder='' id='username' name='username' autoComplete='username' defaultValue={user.username} />
						</fieldset>
						<fieldset>
							<label htmlFor="email">Correo electrónico</label>
							<input type='text' placeholder='' id='email' name='email' autoComplete='username' defaultValue={user.email} />
						</fieldset>
						<fieldset>
							<label htmlFor="password">Nueva contraseña</label>
							<input type='password' placeholder='' id='password' name='password' autoComplete='new-password' />
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
							Editar
						</button>
					</form>
				</>
			: <NotFound icon='404' title='Usuario no encontrado' message='Verifica la URL o selecciona otro usuario de la lista' buttonIcon='search' buttonText='Buscar' link='~/dashboard/users' />
			}
		</div>
	)
}

export default EditUser