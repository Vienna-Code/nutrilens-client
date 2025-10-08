type User = undefined | null | 'guest' | {
	id: string,
	username: string,
	pfp: string,
	rank: {
		points: number,
		name: string
	}
}

type ComLocation = {
	id: string
	name: string
	distance: number
	rating: number
	coords: [number, number]
}