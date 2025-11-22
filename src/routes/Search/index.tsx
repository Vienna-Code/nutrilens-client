import { PiCaretLeft, PiFunnelBold, PiXBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { Link, useLocation } from 'wouter'
import { useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Checkbox, FormControlLabel, Slider } from '@mui/material'
import './styles.scss'
import Api from '../../utils/api'

const Search = () => {
	const [, navigate] = useLocation()
	const [search, setSearch] = useState('')
	const [searchCom, setSearchCom] = useState<Commerce[]>()
	const [filters, setFilters] = useState({
		range: [0, 2500],
		aptFor: {
			celiac: false,
			diabetic: false,
			hypertensive: false
		},
		comType: {
			kiosk: false,
			supermarket: false,
			restaurant: false
		}
	})
	const [filtersActive, setFiltersActive] = useState(false)
	
	const handleApt = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.currentTarget

		setFilters(prev => ({ ...prev, aptFor: {
			...prev.aptFor,
			[name]: checked
		} }))
	}

	const handleType = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.currentTarget

		setFilters(prev => ({ ...prev, comType: {
			...prev.comType,
			[name]: checked
		} }))
	}

	const searchWithOptions = (value: string) => {
		if (value === '') return
		
		Api.getCommerces({
			name: value,
			minPrice: filters.range[0],
			maxPrice: filters.range[1],
			restrictions: Object.values(filters.aptFor).every(x => !x) ? undefined : Object.entries(filters.aptFor).filter(x => x[1]).map(x => x[0]) as ('celiac'|'diabetic'|'hypertensive')[],
			commerceTypes: Object.values(filters.comType).every(x => !x) ? undefined : Object.entries(filters.comType).filter(x => x[1]).map(x => x[0]) as ('kiosk'|'supermarket'|'restaurant')[],
			unverified: true
		}).then(data => setSearchCom(data.data))
	}

	let timer: ReturnType<typeof setTimeout>
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		clearTimeout(timer)
		const { value } = e.currentTarget
		setSearch(value)

		timer = setTimeout(() => {
			searchWithOptions(value)
		}, 1500)
	}

	const toggleFilters = () => {
		if (filtersActive) searchWithOptions(search)
		
		setFiltersActive(!filtersActive)
	}

	const sxCheck = { color: 'var(--ac-color)', '&.Mui-checked': { color: 'var(--ac-color)' } }
	
	return (
		<div className={styles.search}>
			<Link to='/' className={styles.back}>
				<div className={styles.icon}>
					<PiCaretLeft />
				</div>
				Atrás
			</Link>
			<div className={styles.searchBar}>
				<div className={styles.bar}>
					<input type="text" onChange={handleSearch} placeholder='Buscar comercios o productos...' />
				</div>
				<button onClick={() => toggleFilters()} className={filtersActive ? styles.active : ''}>
					{filtersActive ? <PiXBold /> : <PiFunnelBold />}
				</button>
			</div>
			<div className={styles.wrapper}>
				<AnimatePresence mode='popLayout'>
					{filtersActive ?
						<motion.div className={styles.filters} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={'filters'}>
							<div className={styles.sort}>
								Ordenar por
								<div className={styles.select}>
									<select defaultValue="">
										<option value="" disabled>Seleccione una opción</option>
										<option value="nameasc">Nombre A-Z</option>
										<option value="namedesc">Nombre Z-A</option>
									</select>
								</div>
							</div>
							<div className={styles.price}>
								Rango de precio
								<span>${filters.range[0]} - ${filters.range[1]}</span>
								<div className={styles.range}>
									<Slider value={filters.range} onChange={(_e, newValue) => setFilters(prev => ({ ...prev, range: newValue }))} valueLabelDisplay='auto' min={0} max={2500} className={styles.slider} />
								</div>
							</div>
							<div className={styles.aptFor}>
								Apto para
								<div className={styles.fields}>
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.celiac} onChange={handleApt} name='celiac' />} label="Celíacos" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.diabetic} onChange={handleApt} name='diabetic' />} label="Diabéticos" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.hypertensive} onChange={handleApt} name='hypertensive' />} label="Hipertensos" />
								</div>
							</div>
							<div className={styles.type}>
								Tipo comercio
								<div className={styles.fields}>
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.comType.kiosk} onChange={handleType} name='kiosk' />} label="Kiosco" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.comType.supermarket} onChange={handleType} name='supermarket' />} label="Supermercado" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.comType.restaurant} onChange={handleType} name='restaurant' />} label="Restaurante" />
								</div>
							</div>
						</motion.div>
					: searchCom && searchCom.length > 0 ?
						<motion.div className={styles.results} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={'results'}>
							<div className={styles.section}>
								Lugares más cercanos
								<div className={styles.locations}>
									<AnimatePresence>
										{searchCom && searchCom.sort().map(({ id, name }) => {
											const handleClick = () => {
												navigate(`/commerce/${id}`)
											}
											// const parseDistance = distance >= 1000 ? `${distance / 1000}km` : `${distance}m`
											
											return (
												<motion.button className={styles.location} key={id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClick}>
													<div className={styles.name}>
														{name}
													</div>
													•
													<div className={styles.distance}>
														{/* {parseDistance} */}
													</div>
												</motion.button>
											)
										})}
									</AnimatePresence>
								</div>
							</div>
						</motion.div>
					:
						<div className={styles.notFound}>No se encontraron comercios</div>
					}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Search