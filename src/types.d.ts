type User = undefined | null | 'guest' | {
	id: string,
	username: string,
	email: string,
	profile_picture: string|null,
	points: number,
	roles: ('ROLE_USER'|'ROLE_ADMIN')[],
	alimentaryRestrictions: string[],
	createdAt: string
}

type Commerce = {
	id: string,
	name: string,
	type: 'restaurant'|'kiosk'|'supermarket',
	address: number,
	verified: boolean,
	contactInfo: {
		number: string,
		email: string
	},
	commerceSchedules: {
		closesAt: string,
		opensAt: string,
		weekday: number
	}[],
	positiveReviews: number,
	totalReviews: number,
	paymentMethods: ('efectivo'|'credito'|'debito')[],
	coordsLat: number,
	coordsLon: number
}