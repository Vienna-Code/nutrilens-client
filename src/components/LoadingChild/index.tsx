import styles from './styles.module.scss'

const LoadingChild = () => {
	return (
		<div className={styles.loadingChild}>
			<div className={styles.loader}></div>
		</div>
	)
}

export default LoadingChild