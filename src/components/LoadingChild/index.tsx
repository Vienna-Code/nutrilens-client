import styles from './styles.module.scss'

const LoadingChild = ({ absolute, transparent }: { absolute?: boolean, transparent?: boolean }) => {
	return (
		<div className={styles.loadingChild} style={{ position: absolute ? 'absolute' : 'initial', opacity: transparent ? 0.9 : 1 }}>
			<div className={styles.loader}></div>
		</div>
	)
}

export default LoadingChild