import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import Map from '../../../components/Map'
import styles from './styles.module.scss'
import type { LatLngTuple } from 'leaflet'
import Api from '../../../utils/api'
import LoadingChild from '../../../components/LoadingChild'
import { PiCaretLeftBold, PiCheckFatBold } from 'react-icons/pi'
import { Link, useLocation, useParams } from 'wouter'
import { Checkbox, FormControlLabel } from '@mui/material'
import Tippy from '@tippyjs/react'
import LoadingPage from '../../../components/LoadingPage'
import { motion } from 'framer-motion'
import DropImage from '../../../components/DropImage'
import { useAllStore } from '../../../store/useAllStore'
import NotFound from '../../../components/NotFound'

const commerceTypes = [
	'kiosk',
	'supermarket',
	'bakery',
	'restaurant'
] as const

const allowedRanks = [
	'gold',
	'platinum'
]

const EditCommerce = () => {
	const { id } = useParams()
	const user = useAllStore(state => state.user)
	const [commerce, setCommerce] = useState<Commerce|null>()
	const [locationList, setLocationList] = useState<{ coords: LatLngTuple, text: string, type: string, name?: string }[]|null|undefined>()
	const [pendingSelection, setPendingSelection] = useState(true)
	const [selectedLocation, setSelectedLocation] = useState<[{ coords: LatLngTuple, text: string, type?: typeof commerceTypes[number] }]|undefined>()
	const [name, setName] = useState('')
	const [type, setType] = useState<typeof commerceTypes[number]|''>('')
	const [search, setSearch] = useState('')
	// const [currentLocation, setCurrentLocation] = useState<LatLngTuple>()
	const [phone, setPhone] = useState('')
	const [images, setImages] = useState<Images<File|string>>([])
	const [schedules, setSchedules] = useState(Array(7).fill(null).map((_x, i) => ({ weekday: i, opensAt: '', closesAt: '' })))
	const [scheduleDay, setScheduleDay] = useState("")
	const [error, setError] = useState({ field: '', message: '' })
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(8)
	const nameRef = useRef<HTMLInputElement>(null)
	const [, navigate] = useLocation()
	
	// useEffect(() => {
	// 	if (navigator.geolocation) {
	// 		navigator.geolocation.getCurrentPosition(
	// 			(position) => {
	// 				const { latitude, longitude } = position.coords

	// 				setCurrentLocation(() => [latitude, longitude])
	// 			},
	// 			() => {
	// 				setCurrentLocation(undefined)
	// 			}
	// 		)
	// 	}
	// }, [])

	useEffect(() => {
		if (!id) return

		Api.getCommerce(id).then(data => {
			setCommerce(data.data)
			setSelectedLocation(() => [{ coords: [data.data.coordsLat, data.data.coordsLon], text: data.data.address, type: data.data.type }])
			setName(data.data.name)
			setType(data.data.type)

			const parseImages = data.data.commerceImages ? data.data.commerceImages.map((x: string, i: number) => ({ id: i + 1, image: x })) : []
			setImages(parseImages)

			const parseNumber = data.data.contactInfo.number ? `0${data.data.contactInfo.number.split('+598')[1]}` : ''
			const splitNumber = parseNumber.split('')
			const parsePhone = parseNumber.length === 8 ? `${splitNumber.slice(0, 4).join('')} ${splitNumber.slice(4, 8).join('')}` : parseNumber.length === 9 ? `${splitNumber.slice(0, 3).join('')} ${splitNumber.slice(3, 6).join('')} ${splitNumber.slice(6, 9).join('')}` : parseNumber
			
			setPhone(parsePhone)
			
			setSchedules(prev => prev.map(({ weekday, opensAt, closesAt }) => {
				const findDay = data.data.commerceSchedules.find((x: { weekday: number }) => x.weekday === weekday)

				if (!findDay) return { weekday, opensAt, closesAt }

				const parseOpensAt = findDay.opensAt.split('T')[1].split('+')[0]
				const parseClosesAt = findDay.closesAt.split('T')[1].split('+')[0]

				return {
					weekday,
					opensAt: parseOpensAt,
					closesAt: parseClosesAt
				}
			}))
		}).catch(() => setCommerce(null))
	}, [id])
	
	useEffect(() => {
		if (!search) return
		
		const timer = setTimeout(() => {
			Api.searchAddress(search)
			.then(data => {
				const parseResults = data.length > 0 ? data.map(({ properties, geometry }) => {
					const { name, street, housenumber, city, postcode, osm_value, state } = properties.geocoding
					const address = [
						name,
						street ? `${street}${housenumber ? ` ${housenumber.split(',').join(', ')}` : ''}` : undefined,
						city,
						state == city ? undefined : state,
						postcode
					].filter(x => x !== undefined).join(', ')

					return {
						coords: [geometry.coordinates[1], geometry.coordinates[0]] as LatLngTuple,
						text: address,
						type: osm_value,
						name
					}
				}) : []

				setLocationList(parseResults)
			})
		}, 1500)
		
		return () => clearTimeout(timer)
	}, [search])

	useEffect(() => {
		if (successCounter === 0) navigate('/')
	}, [successCounter])

	if (user === 'guest' || !user || !user.roles.includes('ROLE_ADMIN') && !allowedRanks.includes(user.userRank)) return <NotFound icon='prohibit' title='Rango insuficiente' message='Debes ser de rango oro o superior para modificar un comercio' buttonIcon='commerce' buttonText='Volver al comercio' link='/' />
	
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		if (error) resetError()
		setLocationList(null)
		setPendingSelection(true)
		const { value } = e.currentTarget
	
		setSearch(value)
	}

	const handleSelectAddress = (index: number) => async () => {
		if (!locationList) return
		const { coords, text, type, name } = locationList[index]
		
		setPendingSelection(false)

		Api.checkCommerce(coords)
		.then(() => {
			setSelectedLocation(() => [{ coords, text }])
			setType(commerceTypes.includes(type as typeof commerceTypes[number]) ? type as typeof commerceTypes[number] : '')
			setName(name || '')
			if (nameRef.current) nameRef.current.focus()
		})
		.catch((err) => setError(() => ({ message: err.message, field: 'search' })))
	}

	const handleType = (e: ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.currentTarget

		resetError()
		if (value === '') return setSelectedLocation(prev => prev ? [{ ...prev[0], type: undefined }] : prev)

		setSelectedLocation(prev => prev ? [{ ...prev[0], type: value as typeof commerceTypes[number] }] : prev)
	}

	const handlePhone = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget
		const number = value.replace(/\D+/g, '')

		if (number.length > 9) return e.preventDefault()

		const splitNumber = number.split('')
		const parsePhone = number.length === 8 ? `${splitNumber.slice(0, 4).join('')} ${splitNumber.slice(4, 8).join('')}` : number.length === 9 ? `${splitNumber.slice(0, 3).join('')} ${splitNumber.slice(3, 6).join('')} ${splitNumber.slice(6, 9).join('')}` : number
		
		setPhone(parsePhone)
	}

	const handleOpensAt = (e: ChangeEvent<HTMLInputElement>) => {
		if (isNaN(+scheduleDay)) return e.preventDefault()
		const { value } = e.currentTarget

		setSchedules(prev => prev.map((x, i) => i === +scheduleDay ? ({ ...x, opensAt: value }) : x))
	}

	const handleClosesAt = (e: ChangeEvent<HTMLInputElement>) => {
		if (isNaN(+scheduleDay)) return e.preventDefault()
		const { value } = e.currentTarget

		setSchedules(prev => prev.map((x, i) => i === +scheduleDay ? ({ ...x, closesAt: value }) : x))
	}
	
	const resetError = () => {
		setError(() => ({ field: '', message: '' }))
	}
	
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { commerceName, address, type, paymentMethods1, paymentMethods2, paymentMethods3, email, phone, schedule } = e.currentTarget
		const paymentMethods = [paymentMethods1, paymentMethods2, paymentMethods3]
		
		if (!id) return
		
		if (!paymentMethods.some(x => x.checked)) return setError(() => ({ field: 'paymentMethods', message: 'Debe seleccionar al menos un método de pago' }))
		if (commerceName.value.trim() === '') return setError(() => ({ field: 'name', message: 'Debe especificar el nombre del comercio' }))
		if (address.value.trim() === '') return setError(() => ({ field: 'address', message: 'Debe especificar una dirección' }))
		if (type.value.trim() === '') return setError(() => ({ field: 'type', message: 'Debe especificar un tipo de comercio' }))
		if (schedule.value !== '' && !schedules.every(x => x.closesAt !== '' && x.opensAt !== '')) return setError(() => ({ field: 'schedules', message: 'Debe completar los horarios para todos los días' }))

		const contactInfo = Object.fromEntries(Object.entries({ email: email.value, number: phone.value }).filter(([, value]) => value.trim() !== '').map(([key, value]) => key === 'number' ? [key, `+598${value.replace(/\D+/g, '')}`] : [key, value]))

		if (!selectedLocation) return setError(() => ({ field: 'search', message: 'Debe seleccionar una ubicación válida' }))

		const parseImages = images.length > 0 ? images.map(x => x.image) : undefined

		setLoading(true)

		const uuids = parseImages ? await Api.uploadImages(parseImages).then(uuids => uuids as string[]) : undefined

		const data: AddCommerce = {
			name: commerceName.value.trim(),
			type: type.value,
			coordsLat: selectedLocation[0].coords[0],
			coordsLon: selectedLocation[0].coords[1],
			address: address.value.trim(),
			contactInfo: Object.keys(contactInfo).length > 0 ? contactInfo : undefined,
			paymentMethods: paymentMethods.filter(x => x.checked).map(x => x.value),
			images: uuids,
			commerceSchedules: schedule.value !== '' ? schedules : undefined
		}

		Api.editCommerce(id, data)
		.then(() => {
			setSuccess(true)

			setInterval(() => {
				setSuccessCounter(prev => prev - 1)
			}, 1000)
		}).catch(() => {
			setLoading(false)
		})
	}

	const sxCheck = { color: 'var(--ac-color)', '&.Mui-checked': { color: 'var(--ac-color)' } }
	
	return (
		<div className={styles.editCommerce}>
			{success &&
				<div className={styles.success}>
					<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
						<PiCheckFatBold />
					</motion.div>
					<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
						¡Comercio editado con éxito!
					</motion.div>
					<motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }} onClick={() => navigate('/')}>Volver al inicio ({successCounter})</motion.button>
				</div>
			}
			{commerce === undefined || loading ?
				<LoadingPage absolute />
			: commerce ?
				<>
					<Link to='/' className={styles.back}>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<div className={styles.map}>
						<Map disableLocation center={[-34.90149, -56.16443]} markers={selectedLocation} panTo={selectedLocation ? selectedLocation[0].coords : undefined} />
					</div>
					<form onSubmit={handleSubmit}>
						<h2>Editar un comercio</h2>
						<div className={styles.fields}>
							<Tippy content={error.message} visible={error.field === 'search'} placement='top-start' arrow inertia animation='scale'>
								<fieldset>
									<label htmlFor="search">Buscar lugar...</label>
									<input id='search' className={styles.searchAddress} type="text" onChange={handleSearch} placeholder=' ' disabled={!user.roles.includes('ROLE_ADMIN')} />
									{(locationList !== undefined && pendingSelection) &&
										<div className={styles.results}>
											{locationList === null ?
												<div className={styles.loading}>
													<LoadingChild />
												</div>
											: locationList.length > 0 ? locationList.map(({ coords, text }, i) => {
												return (
													<button className={styles.result} key={coords.join(',')} onClick={handleSelectAddress(i)}>
														{text}
													</button>
												)
											})
											:
												<div className={styles.empty}>
													No se encontraron resultados para esta dirección
												</div>
											}
										</div>
									}
								</fieldset>
							</Tippy>
							<Tippy content={error.message} visible={error.field === 'name'} placement='top-start' arrow inertia animation='scale'>
								<fieldset>
									<label htmlFor="commerceName">Nombre del comercio *</label>
										<input id='commerceName' name='commerceName' required type="text" placeholder=' ' ref={nameRef} key={name} defaultValue={name} onChange={resetError} disabled={!user.roles.includes('ROLE_ADMIN')} />
								</fieldset>
							</Tippy>
							<Tippy content={error.message} visible={error.field === 'address'} placement='top-start' arrow inertia animation='scale'>
								<fieldset>
									<label htmlFor="address">Dirección *</label>
										<input id='address' name='address' type="text" key={selectedLocation ? selectedLocation[0].text : ''} placeholder=' ' defaultValue={selectedLocation ? selectedLocation[0].text : ''} required onChange={resetError} disabled={!user.roles.includes('ROLE_ADMIN')} />
								</fieldset>
							</Tippy>
							<fieldset>
								<div className={styles.select}>
									<div className={styles.arrow}>
										<PiCaretLeftBold />
									</div>
									<label htmlFor="type">Tipo de comercio *</label>
									<Tippy content={error.message} visible={error.field === 'type'} placement='top-start' arrow={true} inertia={true} animation='scale'>
										<select id='type' defaultValue={type} key={type} name="type" required onChange={handleType} disabled={!user.roles.includes('ROLE_ADMIN')}>
											<option value="" disabled>Seleccione una opción</option>
											<option value="kiosk">Kiosco</option>
											<option value="supermarket">Supermercado</option>
											<option value="bakery">Panadería</option>
											<option value="restaurant">Restaurante</option>
										</select>
									</Tippy>
								</div>
							</fieldset>
							<fieldset className={styles.mixed}>
								<span className={styles.title}>Métodos de pago *</span>
								<Tippy content={error.message} visible={error.field === 'paymentMethods'} placement='top-start' arrow={true} inertia={true} animation='scale'>
									<div className={styles.checks}>
										<FormControlLabel control={<Checkbox sx={sxCheck} name='paymentMethods1' defaultChecked={commerce.paymentMethods.includes('efectivo')} />} value='efectivo' label="Efectivo" onChange={resetError} />
										<FormControlLabel control={<Checkbox sx={sxCheck} name='paymentMethods2' defaultChecked={commerce.paymentMethods.includes('debito')} />} value='debito' label="Débito" onChange={resetError} />
										<FormControlLabel control={<Checkbox sx={sxCheck} name='paymentMethods3' defaultChecked={commerce.paymentMethods.includes('credito')} />} value='credito' label="Crédito" onChange={resetError} />
									</div>
								</Tippy>
							</fieldset>
							<fieldset>
								<label htmlFor="email">Correo electrónico</label>
								<input id="email" name="email" type="email" placeholder=' ' defaultValue={commerce.contactInfo?.email || ''} />
							</fieldset>
							<fieldset>
								<label htmlFor="phone">Número de contacto</label>
								<input id='phone' name='phone' type="text" placeholder=' ' value={phone} onChange={handlePhone} onKeyDown={e => { if (e.key === '+' || e.key === '-' || e.key === 'e') e.preventDefault() }} />
							</fieldset>
							<DropImage<File|string> images={images} setImages={setImages} type='comercio' square={false} label='Imágenes' disabled={!user.roles.includes('ROLE_ADMIN')} />
							<fieldset className={styles.mixed}>
								<span className={styles.title}>Horarios</span>
								<Tippy content={error.message} visible={error.field === 'schedules'} placement='top-start' arrow={true} inertia={true} animation='scale'>
									<div className={styles.select}>
										<div className={styles.arrow}>
											<PiCaretLeftBold />
										</div>
										<label htmlFor="schedule">Día de la semana</label>
										<select id='schedule' defaultValue="" name="schedule" onChange={e => { setScheduleDay(e.currentTarget.value); resetError() }}>
											<option value="">Sin especificar</option>
											<option value="1">Lunes</option>
											<option value="2">Martes</option>
											<option value="3">Miércoles</option>
											<option value="4">Jueves</option>
											<option value="5">Viernes</option>
											<option value="6">Sábado</option>
											<option value="0">Domingo</option>
										</select>
									</div>
								</Tippy>
								<div className={styles.hours}>
									<fieldset>
										<label htmlFor="opensAt">Abre a las</label>
										<input id='opensAt' type="time" placeholder=' ' value={schedules[isNaN(+scheduleDay) ? 1 : +scheduleDay].opensAt} onChange={handleOpensAt} step="1800" disabled={scheduleDay === ''} />
									</fieldset>
									<fieldset>
										<label htmlFor="closesAt">Cierra a las</label>
										<input id='closesAt' type="time" placeholder=' ' value={schedules[isNaN(+scheduleDay) ? 1 : +scheduleDay].closesAt} onChange={handleClosesAt} step="1800" disabled={scheduleDay === ''} />
									</fieldset>
								</div>
							</fieldset>
							<fieldset>
								<button type='submit'>
									Añadir
								</button>
							</fieldset>
						</div>
					</form>
				</>
			:
				<NotFound icon='404' title='Comercio no encontrado' message='Verifica que la URL sea la correcta o vuelve a buscar el comercio' buttonIcon='search' buttonText='Buscar' link='~/search' />
			}
		</div>
	)
}

export default EditCommerce