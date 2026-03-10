import { useEffect, useState, type FormEvent } from 'react'
import { useAllStore } from '../../../../store/useAllStore'
import styles from './styles.module.scss'
import Api from '../../../../utils/api'
import { Link, useLocation, useParams } from 'wouter'
import NotFound from '../../../../components/NotFound'
import { PiCaretLeftBold, PiCheckFatBold, PiEyeBold, PiEyeClosedBold, PiLockBold } from 'react-icons/pi'
import { motion } from 'framer-motion'
import LoadingPage from '../../../../components/LoadingPage'
import DropImage from '../../../../components/DropImage'
import Tippy from '@tippyjs/react'

const EditPost = () => {
	const { id } = useParams()
	const user = useAllStore(state => state.user)
	const [post, setPost] = useState<Post|null>()
	const [images, setImages] = useState<Images<File|string>>([])
	const [visibility, setVisibility] = useState<'public'|'private'|'delisted'>('public')
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(8)
	const [error, setError] = useState({ field: '', message: '' })
	const [, navigate] = useLocation()

	useEffect(() => {
		if (!id) return
		if (!post) Api.getPost(+id).then(data => {
			setPost(data)
			setVisibility(data.visibility)
			if (data.attachments) setImages(data.attachments.map((x: string, i: number) => ({ id: i + 1, image: x })))
		}).catch(() => setPost(null))
	}, [])

	useEffect(() => {
		if (successCounter === 0) navigate('/')
	}, [successCounter])

	if (!user || user === 'guest' || post && (!user.roles.includes('ROLE_ADMIN') && post.user.id !== user.id)) return <NotFound icon='prohibit' title='No puedes editar un post que no es tuyo' message='Verifica la URL o vuelve a buscar' buttonIcon='post' buttonText='Volver' link='~/community' back='/' />

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!id || !post) return

		const { postTitle, content, visibility } = e.currentTarget

		if (postTitle.value.trim() === '') return setError(() => ({ field: 'title', message: 'El título del post no puede estar vacío' }))
		if (content.value.trim() === '') return setError(() => ({ field: 'content', message: 'El contenido del post no puede estar vacío' }))

		setLoading(true)

		const parseImages = (post.attachments && post.attachments.every((x, i) => x === images[i].image)) ? undefined : images.length > 0 ? await Api.uploadImages(images.map(x => x.image)) : null

		const newPost = {
			title: postTitle.value || undefined,
			content: content.value || undefined,
			attachments: parseImages,
			visibility: visibility.value === post.visibility ? undefined : visibility.value,
			tags: []
		}

		if (!user.roles.includes('ROLE_ADMIN')) delete newPost.title

		Api.editPost(id, newPost)
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
		<div className={styles.editPost}>
			{success &&
				<div className={styles.success}>
					<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
						<PiCheckFatBold />
					</motion.div>
					<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
						¡Post editado con éxito!
					</motion.div>
					<motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }} onClick={() => navigate('/')}>Volver a los posts ({successCounter})</motion.button>
				</div>
			}
			{loading && <LoadingPage absolute />}
			{post === undefined ? <LoadingPage />
			: post ?
				<>
					<Link to='/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Volver
					</Link>
					<h2>Editar post</h2>
					<form onSubmit={handleSubmit}>
						<Tippy content={error.message} visible={error.field === 'title'}>
							<fieldset>
								<label htmlFor="title">Título *</label>
								<input type='text' name='postTitle' id='title' placeholder='' required onChange={() => error.field && setError(() => ({ field: '', message: '' }))} defaultValue={post.title} disabled={!user.roles.includes('ROLE_ADMIN')} />
							</fieldset>
						</Tippy>
						<Tippy content={error.message} visible={error.field === 'content'}>
							<fieldset>
								<label htmlFor="content">Contenido del post... *</label>
								<textarea id='content' name='content' placeholder='' required onChange={() => error.field && setError(() => ({ field: '', message: '' }))} defaultValue={post.content}></textarea>
							</fieldset>
						</Tippy>
						<Tippy content={error.message} visible={error.field === 'images'}>
							<DropImage<File|string> images={images} setImages={setImages} square={false} type='post' label='Imágenes' alt />
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
									<input type="radio" value='public' name='visibility' id='public' defaultChecked={visibility === 'public'} onChange={e => e.currentTarget.checked && setVisibility('public')} />
									{visibility === 'public' && <motion.div layoutId='bg' className={styles.bg}></motion.div>}
								</div>
								<div className={styles.option}>
									<label htmlFor="private">
										<div className={styles.icon}>
											<PiEyeClosedBold />
										</div>
										Privado
									</label>
									<input type="radio" value='private' name='visibility' id='private' onChange={e => e.currentTarget.checked && setVisibility('private')} defaultChecked={visibility === 'private'} />
									{visibility === 'private' && <motion.div layoutId='bg' className={styles.bg}></motion.div>}
								</div>
								{user.roles.includes('ROLE_ADMIN') &&
									<div className={`${styles.option} ${styles.unlisted}`}>
										<label htmlFor="delisted">
											<div className={styles.icon}>
												<PiLockBold />
											</div>
											No listado
										</label>
										<input type="radio" value='delisted' name='visibility' id='delisted' onChange={e => e.currentTarget.checked && setVisibility('delisted')} defaultChecked={visibility === 'delisted'} />
										{visibility === 'delisted' && <motion.div layoutId='bg' className={styles.bg}></motion.div>}
									</div>
								}
							</div>
						</fieldset>
						<button type='submit'>Editar</button>
					</form>
				</>
			: <NotFound icon='post' title='Post no encontrado' message='Verifica la URL o vuelve a buscar' buttonIcon='post' buttonText='Volver' link='~/community' />
			}
		</div>
	)
}

export default EditPost