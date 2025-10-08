import { PiPlusBold } from 'react-icons/pi'
import Map from '../../components/Map'
import styles from './styles.module.scss'
import Icon from '../../components/Icon'
import { useLocation } from 'wouter'

const Home = () => {
	const [, navigate] = useLocation()
	
	const handleSearch = () => {
		navigate('/search')
	}
	
	return (
		<div className={styles.home}>
			<div className={styles.controlsWrapper}>
				<div className={styles.controls}>
					<div className={styles.nav}>
						<div className={styles.mainButton}>
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
						</div>
					</div>
				</div>
			</div>
			<Map coords={[-34.9065941,-56.1860929]} text='Intendencia de Montevideo' />
		</div>
	)
}

export default Home