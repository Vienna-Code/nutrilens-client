import styles from './styles.module.scss'

const LoadingPage = () => {
	return (
		<div className={styles.loadingPage}>
			<div className={styles.loader}></div>
		</div>
	)
}

export default LoadingPage