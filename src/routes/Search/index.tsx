import { PiCaretLeft, PiFunnelBold, PiXBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { useLocation } from 'wouter'
import { useEffect, useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Checkbox, FormControlLabel, Slider } from '@mui/material'
import './styles.scss'

const Search = () => {
	const [, navigate] = useLocation()
	const [locations, setLocations] = useState<ComLocation[]>()
	const [matches, setMatches] = useState<ComLocation[]>()
	const [filters, setFilters] = useState({
		range: [0, 1000],
		aptFor: {
			cel: false,
			dia: false,
			hip: false
		},
		type: {
			food: false,
			drink: false
		}
	})
	const [filtersActive, setFiltersActive] = useState(false)

	useEffect(() => {
		if (locations) return

		fetch('/locations.json').then(res => res.json().then(json => {
			if (!res.ok) throw new Error('File does not exist')

			setLocations(json)
		}))
	}, [])
	
	const handleBack = () => {
		navigate('/')
	}

	const handleApt = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.currentTarget

		setFilters(prev => ({ ...prev, aptFor: {
			...prev.aptFor,
			[name]: checked
		} }))
	}

	const handleType = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.currentTarget

		setFilters(prev => ({ ...prev, type: {
			...prev.type,
			[name]: checked
		} }))
	}

	let timer: ReturnType<typeof setTimeout>
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		if (!locations) return
		
		clearTimeout(timer)
		const { value } = e.currentTarget

		timer = setTimeout(() => {
			const matchLocations = locations.filter(x => value == '' ? false : x.name.toLowerCase().includes(value.toLowerCase()))
			
			setMatches(matchLocations)
		}, 1500)
	}

	const sxCheck = { color: 'var(--ac-color)', '&.Mui-checked': { color: 'var(--ac-color)' } }
	
	return (
		<div className={styles.search}>
			<div className={styles.back} onClick={handleBack}>
				<div className={styles.icon}>
					<PiCaretLeft />
				</div>
				Atrás
			</div>
			<div className={styles.searchBar}>
				<div className={styles.bar}>
					<input type="text" onChange={handleSearch} placeholder='Buscar comercios o productos...' />
				</div>
				<button onClick={() => setFiltersActive(!filtersActive)} className={filtersActive ? styles.active : ''}>
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
									<Slider value={filters.range} onChange={(_e, newValue) => setFilters(prev => ({ ...prev, range: newValue }))} valueLabelDisplay='auto' min={0} max={1000} className={styles.slider} />
								</div>
							</div>
							<div className={styles.aptFor}>
								Apto para
								<div className={styles.fields}>
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.cel} onChange={handleApt} name='cel' />} label="Celíacos" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.dia} onChange={handleApt} name='dia' />} label="Diabéticos" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.aptFor.hip} onChange={handleApt} name='hip' />} label="Hipertensos" />
								</div>
							</div>
							<div className={styles.type}>
								Tipo de alimento
								<div className={styles.fields}>
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.type.food} onChange={handleType} name='food' />} label="Comida" />
									<FormControlLabel control={<Checkbox sx={sxCheck} checked={filters.type.drink} onChange={handleType} name='drink' />} label="Bebida" />
								</div>
							</div>
						</motion.div>
					: matches && matches.length > 0 ?
						<motion.div className={styles.results} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={'results'}>
							<div className={styles.section}>
								Lugares más cercanos
								<div className={styles.locations}>
									<AnimatePresence>
										{matches && matches.sort((a, b) => a.distance - b.distance).map(({ id, name, distance }) => {
											const handleClick = () => {
												navigate(`/location/${id}`)
											}
											const parseDistance = distance >= 1000 ? `${distance / 1000}km` : `${distance}m`
											
											return (
												<motion.button className={styles.location} key={id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClick}>
													<div className={styles.name}>
														{name}
													</div>
													•
													<div className={styles.distance}>
														{parseDistance}
													</div>
												</motion.button>
											)
										})}
									</AnimatePresence>
								</div>
							</div>
							<div className={styles.section}>
								Lugares más populares
								<div className={styles.locations}>
									<AnimatePresence>
										{matches && matches.map(({ id, name, distance }) => {
											const handleClick = () => {
												navigate(`/location/${id}`)
											}
											
											const parseDistance = distance >= 1000 ? `${distance / 1000}km` : `${distance}m`
											
											return (
												<motion.button className={styles.location} key={id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClick}>
													<div className={styles.name}>
														{name}
													</div>
													•
													<div className={styles.distance}>
														{parseDistance}
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