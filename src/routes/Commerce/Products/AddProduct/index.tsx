import { Link, useLocation, useParams } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiCheckFatBold } from 'react-icons/pi'
import { useEffect, useState, type FormEvent } from 'react'
import Api from '../../../../utils/api'
import LoadingPage from '../../../../components/LoadingPage'
import { Checkbox, FormControlLabel } from '@mui/material'
import Tippy from '@tippyjs/react'
import { motion } from 'framer-motion'
import DropImage from '../../../../components/DropImage'

const AddProduct = () => {
	const { id } = useParams()
	const [, navigate] = useLocation()
	const [commerce, setCommerce] = useState<Commerce>()
	const [error, setError] = useState({ field: '', message: '' })
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [successCounter, setSuccessCounter] = useState(8)
	const [images, setImages] = useState<Images<File>>([])

	useEffect(() => {
		if (commerce !== undefined) return

		Api.getCommerce(id as string)
		.then(data => {
			setCommerce(data.data)
		})
	}, [id])

	const trim = (string: string) => {
		return string.trim()
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { productName, brand, type, price, aptFor1, aptFor2, aptFor3 } = e.currentTarget

		const aptFor = [aptFor1, aptFor2, aptFor3]

		if (!aptFor.some(x => x.checked)) return setError(() => ({ field: 'aptFor', message: 'Debe seleccionar al menos una restricción alimenticia' }))

		if (!trim(productName.value)) return setError(() => ({ field: 'name', message: 'Debe especificar el nombre del producto' }))
		if (!trim(brand.value)) return setError(() => ({ field: 'brand', message: 'Debe especificar la marca del producto' }))
		if (!trim(price.value)) return setError(() => ({ field: 'price', message: 'Debe especificar el precio del producto' }))
		if (isNaN(+!trim(price.value))) return setError(() => ({ field: 'price', message: 'El precio del producto debe ser un número' }))
		if (+trim(price.value) <= 0) return setError(() => ({ field: 'price', message: 'El precio del producto debe ser mayor a 0' }))
		if (images.length < 1) return setError(() => ({ field: 'images', message: 'Debe adjuntar al menos una imagen del producto' }))
			
		if (!id) return

		const parseImages = images.map(x => x.image)

		setLoading(false)
		
		const uuids = await Api.uploadImages(parseImages).then(uuids => uuids as string[])

		const newProduct = {
			commerceId: +id,
			name: trim(productName.value),
			brand: trim(brand.value),
			category: trim(type.value) as 'food'|'drink',
			price: +trim(price.value),
			images: uuids,
			aptFor: aptFor.filter(x => x.checked).map(x => x.value)
		}
		
		Api.addProduct(newProduct)
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
		if (error.field) resetError()
	}, [images])

	useEffect(() => {
		if (successCounter === 0) navigate('/..')
	}, [successCounter])

	const resetError = () => {
		setError(() => ({ field: '', message: '' }))
	}
	
	const sxCheck = { color: 'var(--ac-color)', '&.Mui-checked': { color: 'var(--ac-color)' } }

	return (
		<div className={styles.addProduct}>
			{success &&
				<div className={styles.success}>
					<motion.div initial={{ opacity: 0, scale: 0, rotate: 360 }} animate={{ opacity: 1, scale: 1, rotate: 1 }} className={styles.icon}>
						<PiCheckFatBold />
					</motion.div>
					<motion.div className={styles.message} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}>
						Producto añadido con éxito!
					</motion.div>
					<motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }} onClick={() => navigate('/..')}>Volver ({successCounter})</motion.button>
				</div>
			}
			{commerce === undefined || loading ? <LoadingPage absolute />
			:
				<>
					<Link to={'/..'}>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<form onSubmit={handleSubmit}>
						<div className={styles.title}>
							<h2>Añadir un producto</h2>
							<span>{commerce.name}</span>
						</div>
						<div className={styles.fields}>
							<Tippy content={error.message} visible={error.field == 'name'} placement='top-start'>
								<fieldset>
									<label htmlFor="productName">Nombre del producto *</label>
									<input id='productName' name='productName' required type="text" placeholder=' ' onChange={resetError} />
								</fieldset>
							</Tippy>
							<Tippy content={error.message} visible={error.field == 'brand'} placement='top-start'>
								<fieldset>
									<label htmlFor="brand">Marca *</label>
									<input id='brand' name='brand' required type="text" placeholder=' ' onChange={resetError} />
								</fieldset>
							</Tippy>
							<Tippy content={error.message} visible={error.field == 'type'} placement='top-start'>
								<fieldset>
									<div className={styles.select}>
										<div className={styles.arrow}>
											<PiCaretLeftBold />
										</div>
										<label htmlFor="type">Tipo de producto *</label>
										<select id='type' name="type" defaultValue={''} required onChange={resetError}>
											<option value="" disabled>Seleccione una opción</option>
											<option value="food">Comida</option>
											<option value="drink">Bebida</option>
										</select>
									</div>
								</fieldset>
							</Tippy>
							<Tippy content={error.message} visible={error.field == 'price'} placement='top-start'>
								<fieldset>
									<label htmlFor="price">Precio *</label>
									<input id='price' name='price' required type="number" placeholder=' ' onChange={resetError} />
									<div className={styles.sublabel}>
										$
									</div>
								</fieldset>
							</Tippy>
							<Tippy content={error.message} visible={error.field == 'images'}>
								<fieldset>
									<DropImage<File> images={images} setImages={setImages} type='producto' label='Imágenes *' />
								</fieldset>
							</Tippy>
							<Tippy content={error.message} visible={error.field == 'aptFor'} placement='top-start'>
								<fieldset className={styles.mixed}>
									<span className={styles.title}>Apto para *</span>
									<div className={styles.checks}>
										<FormControlLabel control={<Checkbox sx={sxCheck} name='aptFor1' />} value='celiac' label="Celíaco" onChange={resetError} />
										<FormControlLabel control={<Checkbox sx={sxCheck} name='aptFor2' />} value='diabetic' label="Diabético" onChange={resetError} />
										<FormControlLabel control={<Checkbox sx={sxCheck} name='aptFor3' />} value='hypertensive' label="Hipertenso" onChange={resetError} />
									</div>
								</fieldset>
							</Tippy>
							<fieldset>
								<button type='submit'>
									Añadir
								</button>
							</fieldset>
						</div>
					</form>
				</>
			}
		</div>
	)
}

export default AddProduct