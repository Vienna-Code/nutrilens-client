import { useLocation, useParams } from 'wouter'
import styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import Map from '../../components/Map'
import { PiCaretLeftBold, PiPathBold, PiStarBold, PiStarFill, PiStarHalfFill } from 'react-icons/pi'

const Location = () => {
	const { id } = useParams()
	const [, navigate] = useLocation()
	const [location, setLocation] = useState<ComLocation|null>()

	useEffect(() => {
		if (location) return

		fetch('/locations.json').then(res => res.json().then(json => {
			if (!res.ok) throw new Error('File does not exist')

			const findLocation = json.find((x: ComLocation) => x.id == id)
			setLocation(findLocation ?? null)
		}))
	}, [])

	return (
		<div className={styles.location}>
			{location ?
				<>
					<div className={styles.back} onClick={() => navigate('/search')}>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</div>
					<div className={styles.map}>
						<Map coords={location.coords} text={location.name} />
					</div>
					<div className={styles.info}>
						<div className={styles.name}>
							{location.name}
						</div>
						<div className={styles.bottom}>
							<div className={styles.rating}>
								{location.rating}
								<div className={styles.stars}>
									{Array(5).fill(null).map((_x, i) => {
										const isHalf = location.rating % 2 !== 0

										return Math.floor(location.rating / 2) >= (i + 1) ? true : isHalf ? 'half' : false
									}).map((x, i) => (
										<div className={styles.star} key={i}>
											{x === 'half' ? <PiStarHalfFill /> : x ? <PiStarFill /> : <PiStarBold />}
										</div>
									))}
								</div>
							</div>
							<button className={styles.route}>
								Cómo llegar
								<div className={styles.icon}>
									<PiPathBold />
								</div>
							</button>
						</div>
					</div>
				</>
			:
				'hola'
			}
		</div>
	)
}

export default Location