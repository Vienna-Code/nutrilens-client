import { Link, useLocation } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiCheckFatBold, PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'
import { useEffect, useState, type FormEvent } from 'react'
import Api from '../../../utils/api'
import Tippy from '@tippyjs/react'
import LoadingPage from '../../../components/LoadingPage'
import { motion } from 'framer-motion'
import DropImage from '../../../components/DropImage'

const AddPost = () => {
	const [images, setImages] = useState<Images<File>>([])
	const [visibility, setVisibility] = useState(true)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState({ field: '', message: '' })
	const [successCounter, setSuccessCounter] = useState(8)
	const [, navigate] = useLocation()
	
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { postTitle, content, visibility } = e.currentTarget

		if (postTitle.value.trim() === '') return setError(() => ({ field: 'title', message: 'El título del post no puede estar vacío' }))
		if (content.value.trim() === '') return setError(() => ({ field: 'content', message: 'El contenido del post no puede estar vacío' }))

		setLoading(true)

		const parseImages = images.length > 0 ? await Api.uploadImages(images.map(x => x.image)) : undefined

		const newPost = {
			title: postTitle.value,
			content: content.value,
			attachments: parseImages,
			visibility: visibility.value,
			tags: []
		}

		Api.addPost(newPost)
		.then(() => {
			setSuccess(true)
			
			setInterval(() => {
				setSuccessCounter(prev => prev - 1)
			}, 1000)
		}).catch(() => {
			setLoading(false)
		})
	}
	
	useEffect(() => {
		if (successCounter === 0) navigate('/')
	}, [successCounter])

	return (
		<div className={styles.addPost}>
			{success &&
				<div className={styles.success}>
					<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
						<PiCheckFatBold />
					</motion.div>
					<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
						¡Post añadido con éxito!
					</motion.div>
					<motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }} onClick={() => navigate('/')}>Volver a los posts ({successCounter})</motion.button>
				</div>
			}
			{loading && <LoadingPage absolute />}
			<Link to='/'>
				<div className={styles.icon}>
					<PiCaretLeftBold />
				</div>
				Volver
			</Link>
			<h2>Añadir post</h2>
			<form onSubmit={handleSubmit}>
				<Tippy content={error.message} visible={error.field === 'title'}>
					<fieldset>
						<label htmlFor="title">Título *</label>
						<input type='text' name='postTitle' id='title' placeholder='' required onChange={() => error.field && setError(() => ({ field: '', message: '' }))} />
					</fieldset>
				</Tippy>
				<Tippy content={error.message} visible={error.field === 'content'}>
					<fieldset>
						<label htmlFor="content">Contenido del post... *</label>
						<textarea id='content' name='content' placeholder='' required onChange={() => error.field && setError(() => ({ field: '', message: '' }))}></textarea>
					</fieldset>
				</Tippy>
				<Tippy content={error.message} visible={error.field === 'images'}>
					<DropImage<File> images={images} setImages={setImages} square={false} type='post' label='Imágenes' alt />
				</Tippy>
				<fieldset className={styles.mixed}>
					<span className={styles.title}>Visibilidad *</span>
					<div className={styles.options}>
						<div className={styles.option}>
							<label htmlFor="public">
								<div className={styles.icon}>
									<PiEyeBold />
								</div>
								Público
							</label>
							<input type="radio" value='public' name='visibility' id='public' defaultChecked onChange={e => e.currentTarget.checked && setVisibility(true)} />
							{visibility && <motion.div layoutId='bg' className={styles.bg}></motion.div>}
						</div>
						<div className={styles.option}>
							<label htmlFor="private">
								<div className={styles.icon}>
									<PiEyeClosedBold />
								</div>
								Privado
							</label>
							<input type="radio" value='private' name='visibility' id='private' onChange={e => e.currentTarget.checked && setVisibility(false)} />
							{!visibility && <motion.div layoutId='bg' className={styles.bg}></motion.div>}
						</div>
					</div>
				</fieldset>
				<button type='submit'>Añadir</button>
			</form>
		</div>
	)
}

export default AddPost