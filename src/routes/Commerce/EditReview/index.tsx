import { Link, useLocation, useParams } from 'wouter'
import LoadingPage from '../../../components/LoadingPage'
import styles from './styles.module.scss'
import { motion } from 'framer-motion'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Api from '../../../utils/api'
import { PiCaretLeftBold, PiCheckFatBold, PiThumbsDownBold, PiThumbsUpBold } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import NotFound from '../../../components/NotFound'

const EditReview = () => {
	const { id } = useParams()
	const [commerce, setCommerce] = useState<Commerce|null>()
	const [review, setReview] = useState<Review|null>()
	const [positive, setPositive] = useState(true)
	const [error, setError] = useState({ type: '', content: '' })
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
		
		Api.getUserReview(id)
		.then(data => {
			setReview(data)
			setCounter(data.content.length)
			setPositive(data.positive)
		}).catch(() => setReview(null))
	}, [id])

	const resetError = () => {
		setError(() => ({ type: '', content: '' }))
	}

	const handleTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (error.type != '') resetError()

		const { value } = e.currentTarget

		setCounter(value.length)
	}
	
	const handlePositive = (e: ChangeEvent<HTMLInputElement>, positive: boolean) => {
		if (error.type != '') resetError()

		const { checked } = e.currentTarget

		if (checked) setPositive(positive)
	}


	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!id || !review) return

		const { content, positive} = e.currentTarget
		const parsePositive = positive.value === 'on'

		if (content.value.trim() == '' || content.value.trim().length < 120) return setError(() => ({ type: 'content', content: 'La reseña debe tener al menos 120 caracteres' }))
		if (content.value.trim().length > 500) return setError(() => ({ type: 'content', content: 'La reseña no puede tener más de 500 caracteres' }))

		const checks = [content.value.trim() === review.content.trim(), parsePositive === review.positive]

		if (checks.every(x => x)) return setError(() => ({ type: 'review', content: 'Debe modificar la reseña para poder editarla' }))

		const body = {
			content: content.value.trim(),
			positive: parsePositive
		}

		setLoading(true)
		
		Api.editReview(id, review.id, body)
		.then(() => {
			setSuccess(true)

			setInterval(() => {
				if (successCounter === 0) return navigate('/')
				
				setSuccessCounter(prev => prev - 1)
			}, 7000)
		}).catch(() => {
			setLoading(false)
			setError(() => ({ type: 'review', content: 'Este usuario ya tiene una reseña creada para este comercio' }))
		})
	}

	return (
		<div className={styles.editReview}>
			{commerce === undefined || review === undefined ?
				<LoadingPage />
			: commerce !== null && review !== null ?
				<>
					{success &&
						<div className={styles.success}>
							<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
								<PiCheckFatBold />
							</motion.div>
							<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
								¡Reseña editada con éxito!
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
						<Tippy content={error.content} visible={error.type === 'content'} placement='top-start' animation='inertia'>
							<fieldset>
								<label htmlFor="content">Escribir reseña...</label>
								<textarea required name="content" id="content" placeholder=' ' onChange={handleTextarea} defaultValue={review.content} maxLength={500}>
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
									<input type="radio" value='on' name='positive' id='on' defaultChecked={review.positive} onChange={e => handlePositive(e, true)} />
									{positive && <motion.div layoutId='bg2' className={styles.bg}></motion.div>}
								</div>
								<div className={styles.option}>
									<label htmlFor="off">
										<div className={styles.icon}>
											<PiThumbsDownBold />
										</div>
										No
									</label>
									<input type="radio" value='off' name='positive' id='off' defaultChecked={!review.positive} onChange={e => handlePositive(e, false)} />
									{!positive && <motion.div layoutId='bg2' className={styles.bg}></motion.div>}
								</div>
							</div>
						</fieldset>
						<Tippy content={error.content} visible={error.type === 'review'} placement='bottom-start'>
							<button disabled={counter < 120}>
								Editar reseña
							</button>
						</Tippy>
					</form>
				</>
			: commerce === null ?
				<NotFound icon='404' title='Comercio no encontrado' message='Verifica que la URL sea correcta o vuelve a buscar el comercio' buttonIcon='commerce' buttonText='Buscar comercios' link='~/search' />
			:
				<NotFound icon='404' title='Reseña no encontrada' message='No tienes ninguna reseña creada para este comercio' buttonIcon='edit' buttonText='Crear reseña' link='/addReview' />
			}
			
		</div>
	)
}

export default EditReview