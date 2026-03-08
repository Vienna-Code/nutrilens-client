import styles from './styles.module.scss'
import { useAllStore } from '../../store/useAllStore'
import { Link } from 'wouter'
import { PiArrowClockwiseBold, PiCaretLeftBold, PiCheckBold, PiDropSlashBold, PiGrainsSlashBold, PiPencilBold, PiUploadSimpleBold } from 'react-icons/pi'
import Tippy from '@tippyjs/react'
import { parseRank } from '../../utils/ranks'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import Api from '../../utils/api'
import NotFound from '../../components/NotFound'
import LoadingPage from '../../components/LoadingPage'
import { convertImage } from '../../utils/images'
import LoadingChild from '../../components/LoadingChild'
import { TbCubeOff } from 'react-icons/tb'

const parseRestrictions = {
	'celiac': {
		icon: <PiGrainsSlashBold />,
		text: 'Celíaco'
	},
	'hypertensive': {
		icon: <PiDropSlashBold />,
		text: 'Hipertenso'
	},
	'diabetic': {
		icon: <TbCubeOff />,
		text: 'Diabético'
	}
}

const Profile = () => {
	const user = useAllStore(state => state.user)
	const setUser = useAllStore(state => state.setUser)
	const [commercesCount, setCommercesCount] = useState<number>()
	const [productsCount, setProductsCount] = useState<number>()
	const [reviewsCount, setReviewsCount] = useState<number>()
	const [postsCount, setPostsCount] = useState<number>()
	const [clickCounter, setClickCounter] = useState(0)
	const [image, setImage] = useState<File>()
	const [loadingImage, setLoadingImage] = useState(false)
	const [edit, setEdit] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const audioRef = useRef<HTMLAudioElement>(null)
	const audioRef2 = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		Api.getUserCommercesStats().then(data => setCommercesCount(data.total))
		Api.getUserProductsStats().then(data => setProductsCount(data.total))
		Api.getUserReviewsStats().then(data => setReviewsCount(data.total))
		Api.getUserPostsStats().then(data => setPostsCount(data.total))

		if (audioRef.current) audioRef.current.volume = 1
		if (audioRef2.current) audioRef2.current.volume = 1
	}, [])

	useEffect(() => {
		if (clickCounter === 20) {
			if (audioRef.current) audioRef.current.play()
		}

		if (clickCounter === 40) {
			if (audioRef.current) audioRef.current.pause()
			if (audioRef2.current) audioRef2.current.play()
		}
	}, [clickCounter])

	if (!user || user == 'guest') return <NotFound icon='404' title='Usuario no registrado' message='Debes iniciar sesión o registrarte para acceder a esta página' buttonIcon='login' buttonText='Iniciar sesión' link='~/login' />
	
	const rankIndex = parseRank.findIndex(({ rank, points }, i) => rank == user.userRank && (i == 0 ? user.points >= 0 && user.points < points : user.points >= parseRank[i - 1].points && user.points < points))
	const nextRank = rankIndex == parseRank.length - 1 ? null : parseRank[rankIndex + 1]

	const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.currentTarget

		if (!files) return

		const file = files[0]

		const img = new Image()
		img.src = URL.createObjectURL(file)
		img.addEventListener('load', async () => {
			const newThumb = await convertImage(img, file.name, true, 200)

			if (newThumb) setImage(newThumb)
		})

		e.currentTarget.value = ''
	}

	const handleImageUpload = () => {
		if (!image) return

		setLoadingImage(true)
		
		Api.uploadImages([image])
		.then(uuids => {
			const [uuid] = uuids

			Api.uploadUserImage(uuid)
			.then(data => {
				setUser(data.data)
				setLoadingImage(false)
				setImage(undefined)
			})
		})
	}

	const handleRestrictions = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const { celiac, diabetic, hypertensive } = e.currentTarget
		const restrictions = [
			{ name: 'celiac', value: celiac.checked },
			{ name: 'diabetic', value: diabetic.checked },
			{ name: 'hypertensive', value: hypertensive.checked }
		]

		const parseRestrictions = restrictions.filter(x => x.value).map(x => x.name) as ('celiac'|'diabetic'|'hypertensive')[]

		Api.editUserRestrictions(parseRestrictions)
		.then(data => {
			setUser(data.data)
			setEdit(false)
		})
	}
	
	return (
		<div className={styles.profile}>
			<audio src="/platinum.mp3" loop ref={audioRef}></audio>
			<audio src="/platinum.opus" loop ref={audioRef2}></audio>
			{commercesCount === undefined || productsCount === undefined || reviewsCount === undefined || postsCount === undefined ? <LoadingPage />
			:
				<>
					<Link to='~/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.basicInfo}>
						<div className={styles.profilePicWrapper}>
							<div className={styles.profilePic} onClick={() => !loadingImage && inputRef.current && inputRef.current.click()}>
								{loadingImage && <LoadingChild absolute transparent />}
								<div className={styles.uploadImage}>
									<div className={styles.icon}>
										<PiUploadSimpleBold />
									</div>
									Subir foto de perfil
								</div>
								<img src={image ? URL.createObjectURL(image) : user.profilePicture ? `${import.meta.env.VITE_API_URL}/images/${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user.username}&background=3b9c6a&color=1c1c1c&size=48&font-size=0.35&uppercase=true`} alt='' />
								<input type="file" onChange={handleFile} ref={inputRef} />
							</div>
							{image &&
								<>
									<button className={styles.deny} onClick={() => setImage(undefined)}>
										<PiArrowClockwiseBold />
									</button>
									<button className={styles.accept} onClick={handleImageUpload}>
										<PiCheckBold />
									</button>
								</>
							}
						</div>
						<div className={styles.data}>
							<div className={styles.name}>
								{user.username}
								<Tippy content={parseRank[rankIndex].text}>
									<div className={styles.badge}>
										<img src={parseRank[rankIndex].badge} alt="" />
									</div>
								</Tippy>
							</div>
							<div className={styles.email}>
								{user.email}
							</div>
							<div className={styles.restrictions}>
								{!edit ?
									<>
										{user.alimentaryRestrictions.map(restriction => (
											<Tippy content={parseRestrictions[restriction].text}>
												<div className={styles.restriction}>
													{parseRestrictions[restriction].icon}
												</div>
											</Tippy>

										))}
										<button className={styles.editRestrictions} onClick={() => setEdit(true)}>
											<div className={styles.icon}>
												<PiPencilBold />
											</div>
											Editar
										</button>
									</>
								:
									<form onSubmit={handleRestrictions}>
										<fieldset>
											<label htmlFor="celiac"><PiGrainsSlashBold /></label>
											<input type="checkbox" id='celiac' name='celiac' value='celiac' defaultChecked={user.alimentaryRestrictions.includes('celiac')} />
										</fieldset>
										<fieldset>
											<label htmlFor="diabetic"><TbCubeOff /></label>
											<input type="checkbox" id='diabetic' name='diabetic' value='diabetic' defaultChecked={user.alimentaryRestrictions.includes('diabetic')} />
										</fieldset>
										<fieldset>
											<label htmlFor="hypertensive"><PiDropSlashBold /></label>
											<input type="checkbox" id='hypertensive' name='hypertensive' value='hypertensive' defaultChecked={user.alimentaryRestrictions.includes('hypertensive')} />
										</fieldset>
										<button type='submit'>
											<div className={styles.icon}>
												<PiCheckBold />
											</div>
											Guardar
										</button>
									</form>
								}
							</div>
							<div className={styles.since}>
								Desde el {Intl.DateTimeFormat('es-UY', { dateStyle: 'long', timeStyle: 'short', hour12: false }).format(new Date(user.createdAt))}
							</div>
						</div>
					</div>
					<div className={styles.rank}>
						<div className={styles.progress}>
							<div className={styles.bar}>
								<div className={styles.fill} style={{ width: `${nextRank ? (user.points / Math.floor(parseRank[rankIndex].points)) * 100 : 100}%` }}></div>
							</div>
							<div className={styles.numbers}>
								<div className={styles.specific}>
									{user.points}{nextRank && '/'}{nextRank && Math.floor(parseRank[rankIndex].points)}
								</div>
								{nextRank &&
									<div className={styles.next}>
										<div className={styles.text}>
											Siguiente: {nextRank.text}
										</div>
										<div className={styles.badge}>
											<img src={nextRank.badge} alt="" />
										</div>
									</div>
								}
							</div>
						</div>
					</div>
					<div className={styles.stats}>
						<div className={styles.commerces}>
							<div className={styles.counter}>
								{commercesCount}
							</div>
							<Link to='/commerces'>comercios añadidos</Link>
						</div>
						<div className={styles.products}>
							<div className={styles.counter}>
								{productsCount}
							</div>
							<Link to='/products'>productos añadidos</Link>
						</div>
						<div className={styles.reviews}>
							<div className={styles.counter}>
								{reviewsCount}
							</div>
							<Link to='/reviews'>reseñas creadas</Link>
						</div>
						<div className={styles.posts}>
							<div className={styles.counter}>
								{postsCount}
							</div>
							<Link to='/posts'>posts realizados</Link>
						</div>
					</div>
					<div className={styles.ranks}>
						<h3>Beneficios</h3>
						<div className={`${styles.rank} ${user.userRank === 'bronze' ? styles.active : ''}`}>
							<div className={styles.top}>
								<div className={styles.rankImage}>
									<img src="/bronze3.svg" alt="" />
								</div>
								<div className={styles.title}>
									Bronce {user.userRank === 'bronze' && '(actual)'}
								</div>
							</div>
							<div className={styles.text}>
								<ul>
									<li>Añadir comercios</li>
									<li>Reportar comercios</li>
									<li>Verificar comercios</li>
									<li>Escribir reseñas</li>
									<li>Añadir productos</li>
									<li>Reportar productos</li>
									<li>Verificar productos</li>
									<li>Añadir posts</li>
								</ul>
							</div>
						</div>
						<div className={`${styles.rank} ${user.userRank === 'silver' ? styles.active : ''}`}>
							<div className={styles.top}>
								<div className={styles.rankImage}>
									<img src="/silver3.svg" alt="" />
								</div>
								<div className={styles.title}>
									Plata {user.userRank === 'silver' && '(actual)'}
								</div>
							</div>
							<div className={styles.text}>
								<ul>
									<li>Añadir comercios</li>
									<li>Reportar comercios</li>
									<li>Verificar comercios</li>
									<li>Escribir reseñas</li>
									<li>Añadir productos</li>
									<li>Reportar productos</li>
									<li>Verificar productos</li>
									<li>Añadir posts</li>
									<li className={styles.add}>Modificar productos parcialmente</li>
								</ul>
							</div>
						</div>
						<div className={`${styles.rank} ${user.userRank === 'gold' ? styles.active : ''}`}>
							<div className={styles.top}>
								<div className={styles.rankImage}>
									<img src="/gold3.svg" alt="" />
								</div>
								<div className={styles.title}>
									Oro {user.userRank === 'gold' && '(actual)'}
								</div>
							</div>
							<div className={styles.text}>
								<ul>
									<li>Añadir comercios</li>
									<li>Reportar comercios</li>
									<li>Verificar comercios</li>
									<li>Escribir reseñas</li>
									<li>Añadir productos</li>
									<li>Reportar productos</li>
									<li>Verificar productos</li>
									<li>Añadir posts</li>
									<li>Modificar productos parcialmente</li>
									<li className={styles.add}>Modificar comercios parcialmente</li>
									<li className={styles.add}>Verificar o desverificar productos</li>
								</ul>
							</div>
						</div>
						<div className={`${styles.rank} ${user.userRank === 'platinum' ? styles.active : ''}`}>
							<div className={styles.top}>
								<div className={styles.rankImage} onClick={() => clickCounter < 40 && setClickCounter(prev => prev + 1)}>
									<img src="/platinum3.svg" alt="" />
								</div>
								<div className={styles.title}>
									Platino {user.userRank === 'platinum' && '(actual)'}
								</div>
							</div>
							<div className={styles.text}>
								<ul>
									<li>Añadir comercios</li>
									<li>Reportar comercios</li>
									<li>Verificar comercios</li>
									<li>Escribir reseñas</li>
									<li>Añadir productos</li>
									<li>Reportar productos</li>
									<li>Verificar productos</li>
									<li>Añadir posts</li>
									<li>Modificar productos parcialmente</li>
									<li>Modificar comercios parcialmente</li>
									<li>Verificar o desverificar productos</li>
									<li className={styles.add}>Verificar o desverificar comercios</li>
								</ul>
							</div>
						</div>
						<p>La verificación de productos/comercios de los rangos Bronce y Plata difieren de los de Oro/Platino, ya que los primeros sólo pueden reportar el producto/comercio como existente, y después de muchos reportes de varios usuarios (o una verificación manual por parte de rangos más altos), este queda verificado. Mientras tanto, en el caso de los rangos superiores, estos quedan verificados (o desverificados) completamente sin necesidad de que haya interacción de otros usuarios.</p>
					</div>
				</>
			}
		</div>
	)
}

export default Profile