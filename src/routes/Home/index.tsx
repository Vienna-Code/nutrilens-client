import { PiGearBold, PiGpsBold, PiGpsFixBold, PiListBold, PiPlusBold, PiSignOutBold, PiUserBold, PiXBold } from 'react-icons/pi'
import Map from '../../components/Map'
import styles from './styles.module.scss'
import Icon from '../../components/Icon'
import { useLocation } from 'wouter'
import { useEffect, useState } from 'react'
import Api from '../../utils/api'
import { motion, AnimatePresence } from 'framer-motion' 
import { useAllStore } from '../../store/useAllStore'

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
	
	const handleSearch = () => {
		navigate('/search')
	}

	useEffect(() => {
		if (commerces.length === 0) {
			Api.getCommerces()
			.then(data => {
				setCommerces(data.data)
			})
		}
	}, [])

	const handleSignOut = () => {
		Api.logOut()
		.finally(() => setUser(null))
	}
	
	return (
		<div className={styles.home}>
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
						<motion.div initial={{ x: '-100%' }} animate={{ x: '-4em' }} exit={{ x: '-100%' }} className={styles.menu}>
							<ul>
								<li>
									<div className={styles.icon}><PiUserBold /></div> Perfil
								</li>
								{user && user !== 'guest' && user.roles.includes('ROLE_ADMIN') &&
									<li>
										<div className={styles.icon}><PiGearBold /></div> Panel de control
									</li>
								}
								<li className={styles.last} onClick={handleSignOut}>
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
						<button>
							<div className={styles.icon}>
								<PiPlusBold />
							</div>
						</button>
						<button onClick={() => setLocate(!locate)}>
							<div className={styles.icon}>
								{located ? <PiGpsFixBold /> : <PiGpsBold />}
							</div>
						</button>
					</div>
				</div>
			</div>
			<Map markers={commerces.map(({ coordsLat, coordsLon, name }) => ({ coords: [coordsLat, coordsLon], text: name }))} center={[-34.89829, -56.16730]} />
		</div>
	)
}

export default Home