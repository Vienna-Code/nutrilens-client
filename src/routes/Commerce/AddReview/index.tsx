import { Link, useLocation, useParams } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiCheckFatBold, PiThumbsDownBold, PiThumbsUpBold } from 'react-icons/pi'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import NotFound from '../../../components/NotFound'
import Tippy from '@tippyjs/react'
import { motion } from 'framer-motion'

const AddReview = () => {
	const { id } = useParams()
	const [commerce, setCommerce] = useState<Commerce|null>()
	const [positive, setPositive] = useState(true)
	const [error, setError] = useState<'content'|'positive'|'review'>()
	const [counter, setCounter] = useState(0)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(7)
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!id) return 
		
		Api.getCommerce(id)
		.then(data => {
			setCommerce(data.data)
		}).catch(() => setCommerce(null))
	}, [id])

	const handleTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (error) setError(undefined)

		const { value } = e.currentTarget

		setCounter(value.length)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!id) return

		const { content, positive } = e.currentTarget
		const parsePositive = positive.value === 'on'

		if (content.value.trim() == '' || content.value.trim().length < 120) return setError('content')

		const body = {
			content: content.value.trim(),
			positive: parsePositive
		}

		setLoading(true)
		
		Api.addReview(id, body)
		.then(() => {
			setSuccess(true)

			setInterval(() => {
				if (successCounter === 0) return navigate('/')
				
				setSuccessCounter(prev => prev - 1)
			}, 7000)
		}).catch(() => {
			setLoading(false)
			setError('review')
		})
	}

	return (
		<div className={styles.addReview}>
			{commerce === undefined ?
				<LoadingPage />
			: commerce !== null ?
				<>
					{success &&
						<div className={styles.success}>
							<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
								<PiCheckFatBold />
							</motion.div>
							<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
								¡Reseña añadida con éxito!
							</motion.div>
							<motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }} onClick={() => navigate('/')}>Volver ({successCounter})</motion.button>
						</div>
					}
					{loading && <LoadingPage absolute />}
					<Link to='/' className={styles.back}>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.title}>
						{commerce.name}
					</div>
					<form onSubmit={handleSubmit}>
						<Tippy content={'La reseña debe tener al menos 120 caracteres'} visible={error === 'content'} placement='top-start' arrow={true} inertia={true} animation='scale'>
							<fieldset>
								<label htmlFor="content">Escribir reseña...</label>
								<textarea required name="content" id="content" placeholder=' ' onChange={handleTextarea} maxLength={500}>
								</textarea>
								<div className={`${styles.counter} ${counter >= 120 ? styles.active : ''}`}>
									{counter}
								</div>
							</fieldset>
						</Tippy>
						<fieldset className={styles.mixed}>
							<span className={styles.title}>¿Recomienda este local?</span>
							<div className={styles.options}>
								<div className={styles.option}>
									<label htmlFor="on">
										<div className={styles.icon}>
											<PiThumbsUpBold />
										</div>
										Sí
									</label>
									<input type="radio" value='on' name='positive' id='on' defaultChecked onChange={e => e.currentTarget.checked && setPositive(true)} />
									{positive && <motion.div layoutId='bg2' className={styles.bg}></motion.div>}
								</div>
								<div className={styles.option}>
									<label htmlFor="off">
										<div className={styles.icon}>
											<PiThumbsDownBold />
										</div>
										No
									</label>
									<input type="radio" value='off' name='positive' id='off' onChange={e => e.currentTarget.checked && setPositive(false)} />
									{!positive && <motion.div layoutId='bg2' className={styles.bg}></motion.div>}
								</div>
							</div>
						</fieldset>
						<Tippy content={'Este usuario ya tiene una reseña creada para este comercio'} visible={error === 'review'} placement='bottom-start' arrow={true} inertia={true} animation='scale'>
							<button disabled={counter < 120}>
								Enviar reseña
							</button>
						</Tippy>
					</form>
				</>
			:
				<NotFound icon='404' title='Comercio no encontrado' message='Verifica que la URL sea correcta o vuelve a buscar el comercio' buttonIcon='search' buttonText='Buscar' link='~/search' />
			}
			
		</div>
	)
}

export default AddReview