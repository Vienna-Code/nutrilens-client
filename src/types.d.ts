type Rank = 'bronze'|'silver'|'gold'|'platinum'

type RealUser = {
	id: number,
	username: string,
	email: string,
	profilePicture: string|null,
	points: number,
	roles: ('ROLE_USER'|'ROLE_ADMIN')[],
	userRank: Rank,
	alimentaryRestrictions: ('celiac'|'hypertensive'|'diabetic')[],
	createdAt: string
}

type User = undefined | null | 'guest' | RealUser

type Product = {
	id: number
	commerce: Commerce,
	aptFor: ('celiac'|'hypertensive'|'diabetic')[],
	brand: string,
	category: 'food'|'drink',
	productImages: string[]|null,
	name: string,
	price: number,
	verified: boolean,
	userVerificationReport: boolean|null,
	submittedByUser: boolean
}

type SearchProduct = {
	name?: string,
	restrictions?: ('celiac'|'hypertensive'|'diabetic')[],
	minPrice?: number,
	maxPrice?: number,
	category?: ('food'|'drink')[],
	unverified?: boolean
}

type AddProduct = {
	commerceId: number,
	name: string,
	brand: string,
	category: 'food'|'drink',
	price: number,
	images: string[],
	aptFor: ('celiac'|'hypertensive'|'diabetic')[]
}

type EditProduct = Omit<AddProduct, 'commerceId'> & {
	verified?: boolean
}

type Commerce = {
	id: string,
	name: string,
	type: 'restaurant'|'kiosk'|'supermarket'|'bakery',
	address: string,
	verified: boolean,
	contactInfo?: {
		number?: string,
		email?: string
	},
	commerceImages?: string[],
	commerceSchedules: {
		closesAt: string,
		opensAt: string,
		weekday: number
	}[],
	products: Product[],
	positiveReviews: number,
	totalReviews: number,
	paymentMethods: ('efectivo'|'credito'|'debito')[],
	coordsLat: number,
	coordsLon: number,
	userVerificationReport: boolean|null,
	submittedByUser: boolean
}

type AddCommerce = {
	name: string,
	type: 'restaurant'|'kiosk'|'supermarket'|'bakery',
	address: string,
	coordsLat: number,
	coordsLon: number,
	contactInfo?: {
		number?: string,
		email?: string
	},
	paymentMethods: string[],
	images?: string[],
	commerceSchedules?: {
		weekday: number,
		opensAt: string,
		closesAt: string
	}[]
}

type EditCommerce = {
	name?: string,
	type?: 'restaurant'|'kiosk'|'supermarket'|'bakery',
	address?: string,
	coordsLat?: number,
	coordsLon?: number,
	contactInfo?: {
		number?: string,
		email?: string
	},
	paymentMethods?: string[],
	images?: string[],
	commerceSchedules?: {
		weekday: number,
		opensAt: string,
		closesAt: string
	}[],
	verified?: boolean
}

type AddReport = {
	content: string,
	image?: string
}

type Review = {
	id: number,
	user: {
		id: number,
		username: string,
		profilePicture: string|null,
		userRank: Rank,
		points: number
	},
	liked: boolean|null,
	createdAt: string,
	updatedAt: string,
	positive: boolean,
	content: string,
	useful: number,
	visibility: 'public'|'private'|'unlisted'
}

type NewPost = {
	title: string,
	content: string,
	attachments?: string[],
	tags: string[],
	visibility: 'public'|'private'|'unlisted'
}

interface Post extends NewPost {
	id: number,
	user: {
		id: number,
		username: string,
		profilePicture: string|null,
		userRank: Rank,
		points: number
	},
	liked: boolean|null,
	upvotes: number,
	createdAt: string,
	updatedAt: string,
	views: number,
	totalComments: number
}


type UserComment = {
	id: number,
	user: {
		id: number,
		username: string,
		profilePicture: string|null,
		userRank: Rank,
		points: number
	},
	content: string,
	createdAt: string,
	updatedAt: string,
	replies: UserComment[],
	taggingUser: null|RealUser,
	visibility: 'public'|'private'|'unlisted'
}

type Images<ImageType> = {
	id: number,
	image: ImageType
}[]