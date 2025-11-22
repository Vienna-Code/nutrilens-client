const API_URL = import.meta.env.VITE_API_URL as string
const OSRM_URL = 'http://localhost:5000'

class Api {
	private static newFetch = (url: string, options: RequestInit) => {
		return fetch(`${API_URL}${url}`, options)
		.then(res => res.json().then(json => {
			if (res.ok) return json

			throw new Error(json.error.message)
		}))
	}

	public static getUser = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/auth/me', options)
		.then(data => data.data)
	}

	public static signUp = (username: string, email: string, password: string) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				username,
				email,
				password
			})
		}
		
		return this.newFetch('/auth/signup', options)
		.then(data => data)
	}

	public static logIn = (username: string, password: string) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				username,
				password
			})
		}

		return this.newFetch('/auth/login', options)
		.then(data => data)
	}

	public static logOut = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/auth/logout', options)
	}

	public static getCommerces = (params?: {
		lat?: [number, number],
		lon?: [number, number],
		name?: string,
		minPrice?: number,
		maxPrice?: number,
		restrictions?: ('celiac'|'diabetic'|'hypertensive')[],
		commerceTypes?: ('kiosk'|'supermarket'|'restaurant')[],
		unverified?: boolean
	}) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const mapParams = {
			lat: (value: [number, number]) => value.join(','),
			lon: (value: [number, number]) => value.join(','),
			name: (value: string) => value,
			minPrice: (value: number) => value,
			maxPrice: (value: number) => value,
			restrictions: (value: ('celiac'|'diabetic'|'hypertensive')[]) => value.join(','),
			commerceTypes: (value: ('kiosk'|'supermarket'|'restaurant')[]) => value.join(',')
		}
		const parseParams = !params ? undefined : Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => {
			return key === 'unverified' ? key : `${key}=${mapParams[key as keyof typeof mapParams](value as never)}`
		})

		return this.newFetch(`/commerces${parseParams ? `?${parseParams.join('&')}` : ''}`, options)
		.then(data => data)
	}

	public static getCommerce = (id: string) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		
		return this.newFetch(`/commerces/${id}`, options)
		.then(data => data)
	}

	public static traceRoute = (origin: [number, number], destination: [number, number], profile: 'car'|'bike'|'foot') => {
		return fetch(`${OSRM_URL}/route/v1/${profile}/${origin.join(',')};${destination.join(',')}.json`)
		.then(res => res.json().then(json => {
			if (!res.ok) throw new Error(json.message)

			return json
		})).then(data => {
			console.log(data)
		})
	}
}

export default Api