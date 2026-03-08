import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import { Link } from 'wouter'
import NotFound from '../../../components/NotFound'
import { PiBreadBold, PiCaretLeftBold, PiForkKnifeBold, PiShoppingCartBold, PiStorefrontBold } from 'react-icons/pi'

const typeMap = {
	'kiosk': {
		text: 'Kiosco',
		icon: <PiStorefrontBold />
	},
	'restaurant': {
		text: 'Restaurante',
		icon: <PiForkKnifeBold />
	},
	'supermarket': {
		text: 'Supermercado',
		icon: <PiShoppingCartBold />
	},
	'bakery': {
		text: 'Panadería',
		icon: <PiBreadBold />
	}
}

const ProfileCommerces = () => {
	const [commerces, setCommerces] = useState<Commerce[]>()

	useEffect(() => {
		if (commerces === undefined) Api.getUserCommerces().then(setCommerces)
	}, [])
	
	return (
		<div className={styles.profileCommerces}>
			{commerces === undefined ? <LoadingPage />
			: commerces.length > 0 ?
				<>
					<Link to='/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<h3>Comercios añadidos</h3>
					<div className={styles.list}>
						{commerces.map(({ id, name, address, type }) => (
							<div className={styles.commerce} key={id}>
								<Link to={`~/commerce/${id}`} className={styles.title}>
									{name}
								</Link>
								<div className={styles.info}>
									<div className={styles.type}>
										{typeMap[type].text}
										<div className={styles.icon}>
											{typeMap[type].icon}
										</div>
									</div>
									<div className={styles.address}>
										{address}
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			: <NotFound icon='map' title='No se encontraron comercios' message='No has subido ningún comercio aún' buttonIcon='add' buttonText='Añadir comercio' link='~/add' back='/' />
			}
		</div>
	)
}

export default ProfileCommerces