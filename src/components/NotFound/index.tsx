import { PiLinkBreakBold, PiPencilBold, PiStorefrontBold, PiWarningBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { useLocation } from 'wouter'

const iconDict = {
	'404': <PiLinkBreakBold />,
	'warn': <PiWarningBold />
}

const buttonIconDict = {
	'commerce': <PiStorefrontBold />,
	'edit': <PiPencilBold />
}

const NotFound = ({ icon, title, message, buttonIcon, buttonText, link }: { icon: keyof typeof iconDict, title: string, message: string, buttonIcon: keyof typeof buttonIconDict, buttonText: string, link: string }) => {
	const [, navigate] = useLocation()
	
	return (
		<div className={styles.notFound}>
			<div className={styles.icon}>
				{iconDict[icon]}
			</div>
			<div className={styles.content}>
				<div className={styles.info}>
					<div className={styles.title}>
						{title}
					</div>
					<div className={styles.message}>
						{message}
					</div>
				</div>
				<button onClick={() => navigate(link)}>
					<div className={styles.buttonIcon}>
						{buttonIconDict[buttonIcon]}
					</div>
					{buttonText}
				</button>
			</div>
		</div>
	)
}

export default NotFound