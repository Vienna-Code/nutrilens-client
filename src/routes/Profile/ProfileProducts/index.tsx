import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import { Link } from 'wouter'
import NotFound from '../../../components/NotFound'
import { PiCaretLeftBold } from 'react-icons/pi'

const ProfileProducts = () => {
	const [products, setProducts] = useState<Product[]>()

	useEffect(() => {
		if (products === undefined) Api.getUserProducts().then(setProducts)
	}, [])
	
	return (
		<div className={styles.profileProducts}>
			{products === undefined ? <LoadingPage />
			: products.length > 0 ?
				<>
					<Link to='/'>
						<div className={styles.icon}>
							<PiCaretLeftBold />
						</div>
						Atrás
					</Link>
					<h3>Productos añadidos</h3>
					<div className={styles.list}>
						{products.map(({ id, name, brand, commerce: { id: cid, name: cname } }) => (
							<div className={styles.product} key={id}>
								<Link to={`~/commerce/${cid}/products/${id}`} className={styles.title}>
									{name}, {brand}
								</Link>
								<div className={styles.info}>
									<div className={styles.commerceName}>
										{cname}
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			: <NotFound icon='product' title='No se encontraron productos' message='No has subido ningún producto aún. Busca un comercio para añadir productos' buttonIcon='search' buttonText='Buscar' link='~/search' back='/' />
			}
		</div>
	)
}

export default ProfileProducts