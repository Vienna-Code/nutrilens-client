import { PiAvocadoBold, PiBeerBottleBold, PiBeerSteinBold, PiBowlFoodBold, PiBrandyBold, PiBreadBold, PiCaretLeftBold, PiCarrotBold, PiChatCenteredDotsBold, PiCheeseBold, PiCherriesBold, PiCookieBold, PiFishBold, PiFlagBannerBold, PiForkKnifeBold, PiHamburgerBold, PiIceCreamBold, PiLinkBreakBold, PiMagnifyingGlassBold, PiMapPinBold, PiOnigiriBold, PiPencilBold, PiPizzaBold, PiPlusBold, PiProhibitBold, PiShrimpBold, PiSignInBold, PiStorefrontBold, PiThumbsDownBold, PiUsersBold, PiUsersThreeBold, PiWarningBold } from 'react-icons/pi'
import styles from './styles.module.scss'
import { Link, useLocation } from 'wouter'

const products = [
	<PiBowlFoodBold />,
	<PiFishBold />,
	<PiShrimpBold />,
	<PiHamburgerBold />,
	<PiPizzaBold />,
	<PiAvocadoBold />,
	<PiBeerBottleBold />,
	<PiBeerSteinBold />,
	<PiBrandyBold />,
	<PiBreadBold />,
	<PiCarrotBold />,
	<PiCheeseBold />,
	<PiCherriesBold />,
	<PiCookieBold />,
	<PiIceCreamBold />,
	<PiOnigiriBold />
]

const iconDict = {
	'404': <PiLinkBreakBold />,
	'warn': <PiWarningBold />,
	'map': <PiMapPinBold />,
	'prohibit': <PiProhibitBold />,
	'post': <PiThumbsDownBold />,
	'product': <PiForkKnifeBold />,
	'review': <PiChatCenteredDotsBold />,
	'report': <PiFlagBannerBold />,
	'users': <PiUsersBold />
}

const buttonIconDict = {
	'commerce': <PiStorefrontBold />,
	'edit': <PiPencilBold />,
	'post': <PiUsersThreeBold />,
	'search': <PiMagnifyingGlassBold />,
	'login': <PiSignInBold />,
	'add': <PiPlusBold />,
	'product': products[Math.floor(Math.random() * products.length)]
}

const NotFound = ({ icon, title, message, buttonIcon, buttonText, link, back }: { icon: keyof typeof iconDict, title: string, message: string, buttonIcon?: keyof typeof buttonIconDict, buttonText?: string, link?: string, back?: string }) => {
	const [, navigate] = useLocation()
	
	return (
		<div className={styles.notFound}>
			{back &&
				<Link to={back} className={styles.back}>
					<div className={styles.linkIcon}>
						<PiCaretLeftBold />
					</div>
					Atrás
				</Link>
			}
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
				{buttonIcon && buttonText && link &&
					<button onClick={() => navigate(link)}>
						<div className={styles.buttonIcon}>
							{buttonIconDict[buttonIcon]}
						</div>
						{buttonText}
					</button>
				}
			</div>
		</div>
	)
}

export default NotFound