import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiCheckFatBold } from 'react-icons/pi'
import { Link, useLocation } from 'wouter'
import { motion } from 'framer-motion'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'
import { useAllStore } from '../../../store/useAllStore'
import { Checkbox, FormControlLabel, Typography } from '@mui/material'
import Tippy from '@tippyjs/react'

const EditProfile = () => {
	const user = useAllStore(state => state.user)
	const setUser = useAllStore(state => state.setUser)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(8)
	const [, navigate] = useLocation()
	const [disableNewPass, setDisableNewPass] = useState(true)
	const [error, setError] = useState<string>()

	useEffect(() => {
		if (successCounter === 0) navigate('/')
	}, [successCounter])

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!user || user == 'guest') return

		const { currentPassword, newPassword, aptFor1, aptFor2, aptFor3 } = e.currentTarget

		const parseRestrictions = [aptFor1, aptFor2, aptFor3].filter(x => x.checked).map(x => x.value)

		const newUser: EditUser = {
			currentPassword: currentPassword.value.trim() || undefined,
			newPassword: newPassword.value.trim() || undefined,
			alimentaryRestrictions: parseRestrictions
		}

		setLoading(true)
		
		Api.editUser(newUser)
		.then((data) => {
			setUser(data.data)
			setSuccess(true)
			
			setInterval(() => {
				setSuccessCounter(prev => prev - 1)
			}, 1000)
		}).catch((err) => {
			setError(err.message)
			setLoading(false)
		})
	}

	const handlePassChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget

		if (error !== undefined) setError(undefined)

		if (disableNewPass && value.trim().length > 0) setDisableNewPass(false)
		if (!disableNewPass && value.trim().length === 0) setDisableNewPass(true)
	}

	const sxCheck = { color: 'var(--ac-color)', '&.Mui-checked': { color: 'var(--ac-color)' } }
	
	return (
		<div className={styles.editProfile}>
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
			{user && user !== 'guest' ?
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
							<label htmlFor="currentPassword">Contraseña actual</label>
							<input type='password' placeholder='' id='currentPassword' name='currentPassword' autoComplete='new-password' onChange={handlePassChange} />
						</fieldset>
						<fieldset>
							<label htmlFor="newPassword">Nueva contraseña</label>
							<input type='password' placeholder='' id='newPassword' name='newPassword' autoComplete='new-password' disabled={disableNewPass} onChange={() => { if (error !== undefined) setError(undefined) }} />
						</fieldset>
						<fieldset className={styles.mixed}>
							<span className={styles.title}>Restricciones alimenticias</span>
							<div className={styles.checks}>
								<FormControlLabel control={<Checkbox sx={sxCheck} name='aptFor1' defaultChecked={user.alimentaryRestrictions.includes('celiac')} />} value='celiac' label={<Typography style={{ fontFamily: 'Signika' }}>Celíaco</Typography>} />
								<FormControlLabel control={<Checkbox sx={sxCheck} name='aptFor2' defaultChecked={user.alimentaryRestrictions.includes('diabetic')} />} value='diabetic' label={<Typography style={{ fontFamily: 'Signika' }}>Diabético</Typography>} />
								<FormControlLabel control={<Checkbox sx={sxCheck} name='aptFor3' defaultChecked={user.alimentaryRestrictions.includes('hypertensive')} />} value='hypertensive' label={<Typography style={{ fontFamily: 'Signika' }}>Hipertenso</Typography>} />
							</div>
						</fieldset>
						<Tippy content={'Credenciales incorrectas'} visible={error !== undefined}>
							<button type='submit'>
								Editar
							</button>
						</Tippy>
					</form>
				</>
			: <NotFound icon='404' title='Usuario no encontrado' message='Verifica la URL o selecciona otro usuario de la lista' buttonIcon='search' buttonText='Buscar' link='~/dashboard/users' />
			}
		</div>
	)
}

export default EditProfile