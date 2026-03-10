import { PiDropSlashBold, PiGrainsSlashBold, PiImageBroken } from 'react-icons/pi'
import styles from './styles.module.scss'
import { Link, useLocation } from 'wouter'
import { TbCubeOff } from 'react-icons/tb'
import Tippy from '@tippyjs/react'

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

const ProductsSummary = ({ products }: { products: Product[] }) => {
	const [, navigate] = useLocation()
	
	return (
		<div className={styles.productsSummary}>
			<div className={styles.productsTitle}>
				<h3>Productos destacados</h3>
				<Link to='/products'>
					Ver más
				</Link>
			</div>
			<div className={styles.products}>
				{products.map(({ id, productImages, name, price, aptFor }) => {
					return (
						<div className={styles.product} key={id} onClick={() => navigate(`/products/${id}`)}>
							<div className={styles.image}>
								{productImages ? 
									<img src={`/api/images/${productImages[0]}`} alt="" />
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
					)
				})}
			</div>
		</div>
	)
}

export default ProductsSummary