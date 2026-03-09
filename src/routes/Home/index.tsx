import { PiGearBold, PiGpsBold, PiGpsFixBold, PiListBold, PiPersonSimpleWalkBold, PiPlusBold, PiSignOutBold, PiUserBold, PiUsersThreeBold, PiXBold } from 'react-icons/pi'
import Map from '../../components/Map'
import styles from './styles.module.scss'
import Icon from '../../components/Icon'
import { Link, useLocation } from 'wouter'
import { useEffect, useRef, useState } from 'react'
import Api from '../../utils/api'
import { motion, AnimatePresence } from 'framer-motion' 
import { useAllStore } from '../../store/useAllStore'
import SelectedCommerce from '../../components/SelectedCommerce'
import { Checkbox, FormControlLabel, Typography } from '@mui/material'

const Home = () => {
	const [, navigate] = useLocation()
	const [menu, setMenu] = useState(false)
	const user = useAllStore(state => state.user)
	const setUser = useAllStore(state => state.setUser)
	const commerces = useAllStore(state => state.commerces)
	const setCommerces = useAllStore(state => state.setCommerces)
	const locate = useAllStore(state => state.locate)
	const setLocate = useAllStore(state => state.setLocate)
	const located = useAllStore(state => state.located)
	const selectedCommerce = useAllStore(state => state.selectedCommerce)
	const unverifiedCommerces = useAllStore(state => state.unverifiedCommerces)
	const unverifiedProducts = useAllStore(state => state.unverifiedProducts)
	const setUnverifiedCommerces = useAllStore(state => state.setUnverifiedCommerces)
	const setUnverifiedProducts = useAllStore(state => state.setUnverifiedProducts)
	const routeTo = useAllStore(state => state.routeTo)
	const setRouteTo = useAllStore(state => state.setRouteTo)
	const setRenderRoute = useAllStore(state => state.setRenderRoute)
	const summary = useAllStore(state => state.summary)
	const menuRef = useRef<HTMLDivElement>(null)
	
	const handleSearch = () => {
		navigate('/search')
	}

	useEffect(() => {
		setRenderRoute(true)
		
		if (commerces.length === 0) {
			Api.getCommerces()
			.then(data => {
				setCommerces(data.data)
			})
		}

		return () => {
			setRenderRoute(false)
		}
	}, [])

	const handleSignOut = () => {
		Api.logOut()
		.finally(() => {
			setUser(null)
			setRouteTo(undefined)
		})
	}

	const sxCheck = { color: 'var(--ac-color)', '&.Mui-checked': { color: 'var(--ac-color)' }, alignSelf: 'flex-start' }
	
	return (
		<div className={styles.home}>
			<AnimatePresence>
				{routeTo &&
					<motion.div className={styles.routeTo} initial={{ y: '-100%' }} animate={{ y: '1em' }} exit={{ y: '-100%' }}>
						<div className={styles.info}>
							<div className={styles.icon}>
								<PiPersonSimpleWalkBold />
							</div>
							{summary &&
								<span>
									{summary.totalDistance > 1000 ? `${(summary.totalDistance / 1000).toFixed(2)}km` : `${summary.totalDistance.toFixed(0)}m`}
								</span>
							}
						</div>
						<button onClick={() => setRouteTo(undefined)}>Cancelar</button>
					</motion.div>
				}
			</AnimatePresence>
			<AnimatePresence>
				{selectedCommerce &&
					<SelectedCommerce id={selectedCommerce} />
				}
			</AnimatePresence>
			<button className={styles.menuButton} onClick={() => setMenu(!menu)}>
				<div className={styles.icon}>
					{menu ?
						<PiXBold />
					:
						<PiListBold />
					}
				</div>
			</button>
			<AnimatePresence>
				{menu &&
					<motion.div initial={{ x: '-100%' }} animate={{ x: '-4em' }} exit={{ x: '-100%' }} className={styles.menu} ref={menuRef}>
						<ul>
							{user !== 'guest' &&
								<li>
									<Link to='/profile'>
										<div className={styles.icon}><PiUserBold /></div> Perfil
									</Link>
								</li>
							}
							<li>
								<Link to='/community'>
									<div className={styles.icon}><PiUsersThreeBold /></div> Comunidad
								</Link>
							</li>
							{user && user !== 'guest' && user.roles.includes('ROLE_ADMIN') &&
								<li>
									<Link to='/dashboard'>
										<div className={styles.icon}><PiGearBold /></div> Panel de control
									</Link>
								</li>
							}
							<li className={`${styles.label} ${styles.last}`}>
								<FormControlLabel control={<Checkbox sx={sxCheck} name='unverifiedCommerces' checked={unverifiedCommerces} onChange={e => setUnverifiedCommerces(e.currentTarget.checked)} />} label={<Typography style={{ fontFamily: 'Signika', fontSize: '1em', padding: '7px' }}>Mostrar comercios sin verificar</Typography>} />
							</li>
							<li className={styles.label}>
								<FormControlLabel control={<Checkbox sx={sxCheck} name='unverifiedProducts' checked={unverifiedProducts} onChange={e => setUnverifiedProducts(e.currentTarget.checked)} />} label={<Typography style={{ fontFamily: 'Signika', fontSize: '1em', padding: '7px' }}>Mostrar productos sin verificar</Typography>} />
							</li>
							<li className={styles.signOut} onClick={handleSignOut}>
								<div className={styles.icon}><PiSignOutBold /></div> Cerrar sesión
							</li>
						</ul>
					</motion.div>
				}
			</AnimatePresence>
			<div className={styles.controlsWrapper}>
				<div className={styles.controls}>
					<div className={styles.nav}>
						<button className={styles.main} onClick={handleSearch}>
							<div className={styles.icon}>
								<Icon color='var(--pr-color)' />
							</div>
						</button>
						{user !== 'guest' &&
							<button onClick={() => navigate('/add')}>
								<div className={styles.icon}>
									<PiPlusBold />
								</div>
							</button>
						}
						<button onClick={() => setLocate(!locate)}>
							<div className={styles.icon}>
								{located ? <PiGpsFixBold /> : <PiGpsBold />}
							</div>
						</button>
					</div>
				</div>
			</div>
			<Map markers={commerces.map(({ coordsLat, coordsLon, name, verified, id, type }) => ({ coords: [coordsLat, coordsLon], text: name, verified, id, type }))} center={[-34.89829, -56.16730]} />
		</div>
	)
}

export default Home