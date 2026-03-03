import { PiCaretLeft, PiCaretLeftBold, PiFunnelBold, PiXBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { Link, useLocation } from 'wouter'
import { useEffect, useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Checkbox, FormControlLabel, Slider } from '@mui/material'
import './styles.scss'
import Api from '../../utils/api'

const Search = () => {
	const [, navigate] = useLocation()
	const [search, setSearch] = useState('')
	const [searchCom, setSearchCom] = useState<Commerce[]>()
	const [searchProd, setSearchProd] = useState<Product[]>()
	const [filters, setFilters] = useState({
		range: [0, 9999],
		aptFor: {
			celiac: false,
			diabetic: false,
			hypertensive: false
		},
		comType: {
			kiosk: false,
			supermarket: false,
			bakery: false,
			restaurant: false
		},
		category: {
			food: false,
			drink: false
		},
		orderBy: ''
	})
	const [filtersActive, setFiltersActive] = useState(false)

	const handleCheck = (e: ChangeEvent<HTMLInputElement>, type: 'aptFor'|'comType'|'category') => {
		const { name, checked } = e.currentTarget

		setFilters(prev => ({ ...prev, [type]: {
			...prev[type],
			[name]: checked
		} }))
	}

	const handleOrder = (e: ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.currentTarget

		setFilters(prev => ({ ...prev, orderBy: value }))
	}

	const searchWithOptions = (value: string) => {
		if (value === '') return
		
		Api.getCommerces({
			name: value,
			orderBy: filters.orderBy,
			minPrice: filters.range[0],
			maxPrice: filters.range[1],
			restrictions: Object.values(filters.aptFor).every(x => !x) ? undefined : Object.entries(filters.aptFor).filter(x => x[1]).map(x => x[0]) as ('celiac'|'diabetic'|'hypertensive')[],
			commerceTypes: Object.values(filters.comType).every(x => !x) ? undefined : Object.entries(filters.comType).filter(x => x[1]).map(x => x[0]) as ('kiosk'|'supermarket'|'restaurant')[],
			unverified: true
		}).then(data => setSearchCom(data.data))

		Api.getSearchProducts({
			name: value,
			minPrice: filters.range[0],
			maxPrice: filters.range[1],
			restrictions: Object.values(filters.aptFor).every(x => !x) ? undefined : Object.entries(filters.aptFor).filter(x => x[1]).map(x => x[0]) as ('celiac'|'diabetic'|'hypertensive')[],
			category: Object.values(filters.category).every(x => !x) ? undefined : Object.entries(filters.category).filter(x => x[1]).map(x => x[0]) as ('food'|'drink')[],
			unverified: true
		}).then(setSearchProd)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			searchWithOptions(search)
		}, 1500)

		return () => clearTimeout(timer)
	}, [search])

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget
		setSearch(value)
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
									<div className={styles.arrow}>
										<PiCaretLeftBold />
									</div>
									<select onChange={handleOrder} value={filters.orderBy}>
										<option value="" disabled>Seleccione una opción</option>
										<option value="name_asc">Nombre A-Z</option>
										<option value="name_desc">Nombre Z-A</option>
										<option value="rating_asc">Menor calificación</option>
										<option value="rating_desc">Mayor calificación</option>
										<option value="price_asc">Menor precio</option>
										<option value="price_desc">Mayor precio</option>
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
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.celiac} onChange={e => handleCheck(e, 'aptFor')} name='celiac' />} label="Celíacos" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.diabetic} onChange={e => handleCheck(e, 'aptFor')} name='diabetic' />} label="Diabéticos" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.hypertensive} onChange={e => handleCheck(e, 'aptFor')} name='hypertensive' />} label="Hipertensos" />
								</div>
							</div>
							<div className={styles.type}>
								Tipo comercio
								<div className={styles.fields}>
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.comType.kiosk} onChange={e => handleCheck(e, 'comType')} name='kiosk' />} label="Kiosco" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.comType.supermarket} onChange={e => handleCheck(e, 'comType')} name='supermarket' />} label="Supermercado" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.comType.bakery} onChange={e => handleCheck(e, 'comType')} name='bakery' />} label="Panadería" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.comType.restaurant} onChange={e => handleCheck(e, 'comType')} name='restaurant' />} label="Restaurante" />
								</div>
							</div>
							<div className={styles.type}>
								Tipo producto
								<div className={styles.fields}>
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.category.food} onChange={e => handleCheck(e, 'category')} name='food' />} label="Comida" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.category.drink} onChange={e => handleCheck(e, 'category')} name='drink' />} label="Bebida" />
								</div>
							</div>
						</motion.div>
					: searchCom && searchCom.length > 0 || searchProd && searchProd.length > 0 ?
						<motion.div className={styles.results} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={'results'}>
							{searchProd && searchProd.length > 0 &&
								<div className={styles.section}>
									Productos
									<div className={styles.products}>
										<AnimatePresence>
											{searchProd && searchProd.map(({ id, commerce: { id: cid, name: cname }, name, brand }) => {
												const handleClick = () => {
													navigate(`~/commerce/${cid}/products/${id}`)
												}
												// const parseDistance = distance >= 1000 ? `${distance / 1000}km` : `${distance}m`
												
												return (
													<motion.button className={styles.product} key={id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClick}>
														<div className={styles.name}>
															{name}, {brand}
														</div>
														<div className={styles.commerceName}>
															{cname}
														</div>
													</motion.button>
												)
											})}
										</AnimatePresence>
									</div>
								</div>
							}
							{searchCom && searchCom.length > 0 &&
								<div className={styles.section}>
									Lugares más cercanos
									<div className={styles.locations}>
										<AnimatePresence>
											{searchCom && searchCom.map(({ id, name }) => {
												const handleClick = () => {
													navigate(`~/commerce/${id}`)
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
							}
						</motion.div>
					:
						<div className={styles.notFound}>No se encontraron comercios o productos</div>
					}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Search