import { Link, useLocation, useParams } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiDropSlashBold, PiGrainsSlashBold, PiImageBroken } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Api from '../../../utils/api'
import LoadingPage from '../../../components/LoadingPage'
import { TbCubeOff } from 'react-icons/tb'
import Tippy from '@tippyjs/react'

const Products = () => {
	const [products, setProducts] = useState<Product[]>()
	const { id } = useParams()
	const [, navigate] = useLocation()

	const parseTag = {
		'celiac': {
			icon: <PiGrainsSlashBold />,
			text: 'Celíaco'
		},
		'hypertensive': {
			icon: <PiDropSlashBold />,
			text: 'Hipertenso'
		},
		'diabetic': {
			icon: <TbCubeOff />,
			text: 'Diabético'
		}
	}
	
	useEffect(() => {
		if (!products) {
			Api.getProducts(id as string)
			.then(setProducts)
		}
	}, [])

	return (
		<div className={styles.products}>
			<Link to='/..'>
				<div className={styles.icon}>
					<PiCaretLeftBold />
				</div>
				Atrás
			</Link>
			{products === undefined ?
				<LoadingPage />
			:
				<div className={styles.list}>
					{products.map(({ id, productImages, name, price, aptFor }) => (
							<div className={styles.product} key={id} onClick={() => navigate(`/${id}`)}>
								<div className={styles.image}>
									{productImages ? 
										<img src={`${import.meta.env.VITE_API_URL as string}/images/${productImages[0]}`} alt="" />
									:
										<div className={styles.blankImg}>
											<div className={styles.icon}>
												<PiImageBroken />
											</div>
										</div>
									}
								</div>
								<div className={styles.description}>
									<div className={styles.title}>
										{name}
									</div>
									<div className={styles.price}>
										${price}
									</div>
									<div className={styles.tags}>
										{aptFor.map(tag => (
											<Tippy content={parseTag[tag].text} placement='top-start' arrow={true} inertia={true} animation='scale' key={tag}>
												<div className={styles.tag}>
												{parseTag[tag].icon}
											</div>
											</Tippy>
										))}
									</div>
								</div>
							</div>
					))}
				</div>
			}
		</div>
	)
}

export default Products