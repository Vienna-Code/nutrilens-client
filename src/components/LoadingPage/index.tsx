import styles from './styles.module.scss'

const LoadingPage = ({ absolute }: { absolute?: boolean }) => {
	return (
		<div className={`${styles.loadingPage} ${absolute ? styles.absolute : ''}`}>
			<div className={styles.loader}></div>
		</div>
	)
}

export default LoadingPage