import type { LatLngTuple } from 'leaflet'

const API_URL = '/api'
const OSRM_URL = '/osrm'
const NOMINATIM_URL = '/nominatim'

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

	public static getAdminUser = (id: string) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/users/${id}`, options)
		.then(data => data.data)
	}

	public static getUserCommerces = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/commerces', options)
		.then(data => data.data)
	}

	public static getUserCommercesStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/commerces/stats', options)
		.then(data => data.data)
	}

	public static getUserProducts = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/products', options)
		.then(data => data.data)
	}

	public static getUserProductsStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/products/stats', options)
		.then(data => data.data)
	}

	public static getUserReviews = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/reviews', options)
		.then(data => data.data)
	}

	public static getUserReviewsStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/reviews/stats', options)
		.then(data => data.data)
	}

	public static getUserPosts = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/posts', options)
		.then(data => data.data)
	}

	public static getUserPostsStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/users/me/posts/stats', options)
		.then(data => data.data)
	}

	public static getUsers = (params?: { username?: string, email?: string, orderBy?: string }) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		const parseParams = params ? Object.entries(params).map(([key, value]) => {
			return value ? `${key}=${value}` : ''
		}) : undefined
		
		return this.newFetch(`/users${parseParams ? `?${parseParams.join('&')}` : ''}`, options)
		.then(data => data.data)
	}

	public static getUsersStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}
		
		return this.newFetch('/users/stats', options)
		.then(data => data.data)
	}

	public static uploadUserImage = (uuid: string) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				profilePicture: uuid
			})
		}

		return this.newFetch('/users/me', options)
		.then(data => data)
	}

	public static editUserRestrictions = (alimentaryRestrictions: ('celiac'|'hypertensive'|'diabetic')[]) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				alimentaryRestrictions
			})
		}

		return this.newFetch('/users/me', options)
		.then(data => data)
	}

	public static addUser = (newUser: NewUser) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(newUser)
		}

		return this.newFetch('/users', options)
		.then(data => data)
	}

	public static editUser = (editUser: EditUser) => {
		const parseUser = Object.fromEntries(Object.entries(editUser).filter(([, value]) => value !== undefined))

		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(parseUser)
		}

		return this.newFetch(`/users/me`, options)
		.then(data => data)
	}

	public static editAdminUser = (uid: string, editUser: EditUserAdmin) => {
		const parseUser = Object.fromEntries(Object.entries(editUser).filter(([, value]) => value !== undefined))
		
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(parseUser)
		}

		return this.newFetch(`/users/${uid}`, options)
		.then(data => data)
	}
	
	public static deleteUser = (uid: string) => {
		const options: RequestInit = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/users/${uid}`, options)
		.then(data => data)
	}

	public static getCommerces = (params?: {
		lat?: [number, number],
		lon?: [number, number],
		name?: string,
		orderBy?: string,
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
			},
			credentials: 'include'
		}

		const mapParams = {
			lat: (value: [number, number]) => value.join(','),
			lon: (value: [number, number]) => value.join(','),
			name: (value: string) => value,
			orderBy: (value: string) => value,
			minPrice: (value: number) => value,
			maxPrice: (value: number) => value,
			restrictions: (value: ('celiac'|'diabetic'|'hypertensive')[]) => value.join(','),
			commerceTypes: (value: ('kiosk'|'supermarket'|'restaurant')[]) => value.join(',')
		}
		const parseParams = !params ? undefined : Object.entries(params).filter(([, value]) => value !== undefined && value !== '').map(([key, value]) => {
			return key === 'unverified' ? value ? key : '' : `${key}=${mapParams[key as keyof typeof mapParams](value as never)}`
		})

		return this.newFetch(`/commerces${parseParams ? `?${parseParams.join('&')}` : ''}`, options)
		.then(data => data)
	}

	public static getCommerce = (id: string) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}
		
		return this.newFetch(`/commerces/${id}`, options)
		.then(data => data)
	}

	public static getCommercesStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}
		
		return this.newFetch('/commerces/stats', options)
		.then(data => data.data)
	}

	public static checkCommerce = (coords: LatLngTuple) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/commerces/check-location?coords=${coords.join(',')}`, options)
		.then(data => data)
	}

	public static addCommerce = (commerce: AddCommerce) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(commerce)
		}

		return this.newFetch(`/commerces`, options)
		.then(data => data)
	}

	public static editCommerce = (cid: string, commerce: EditCommerce) => {
		const parseCommerce = Object.fromEntries(Object.entries(commerce).filter(([, value]) => value !== undefined))
		
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(parseCommerce)
		}

		return this.newFetch(`/commerces/${cid}`, options)
		.then(data => data)
		.catch(err => console.error(err.message, err.error))
	}

	public static deleteCommerce = (cid: string) => {
		const options: RequestInit = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}`, options)
		.then(data => data)
	}

	public static verifyCommerce = (cid: string, verify: boolean) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: verify ? 'confirmation' : 'rebuttal'
			}),
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reports`, options)
		.then(data => data)
	}

	public static verifyCommerceAdmin = (cid: string, verify: boolean) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				verified: verify
			}),
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}`, options)
		.then(data => data)
	}

	public static getCommercesReports = (types: ('confirmation'|'rebuttal'|'submission'|'issue')[]) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/jsonm'
			},
			credentials: 'include'
		}

		return this.newFetch(`/reports?resource=commerces&resolved=null&types=${types.join(',')}`, options)
		.then(data => data.data)
	}

	public static reportCommerce = (cid: string, report: AddReport) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...report,
				type: 'issue'
			}),
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reports`, options)
		.then(data => data)
	}

	public static editCommerceReport = (rid: number, cid: string, action: boolean) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				resolved: action
			}),
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reports/${rid}`, options)
		.then(data => data)
	}

	public static getProduct = (pid: number) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/products/${pid}`, options)
		.then(data => data.data)
	}

	public static getProducts = (cid: string) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/products?commerce=${cid}&unverified`, options)
		.then(data => data.data)
	}

	public static getSearchProducts = (searchProduct?: SearchProduct) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		const parseOptions = searchProduct ? Object.entries(searchProduct).filter(([,value]) => value).map(([key, value]) => {
			if (typeof value === 'object') return `${key}=${value.join(',')}`
			if (key === 'unverified') return `${key}`

			return `${key}=${value}`
		}) : undefined

		return this.newFetch(`/products?${parseOptions ? parseOptions.join('&') : ''}`, options)
		.then(data => data.data)
	}

	public static getProductsStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}
		
		return this.newFetch('/products/stats', options)
		.then(data => data.data)
	}

	public static addProduct = (product: AddProduct) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(product)
		}

		return this.newFetch('/products', options)
		.then(data => data)
	}

	public static editProduct = (pid: string, product: EditProduct) => {
		const parseProduct = Object.fromEntries(Object.entries(product).filter(([, value]) => value !== undefined))
		
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(parseProduct)
		}

		return this.newFetch(`/products/${pid}`, options)
		.then(data => data)
	}

	public static deleteProduct = (pid: string) => {
		const options: RequestInit = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/products/${pid}`, options)
		.then(data => data)
	}

	public static verifyProduct = (pid: string, verify: boolean) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				type: verify ? 'confirmation' : 'rebuttal'
			})
		}

		return this.newFetch(`/products/${pid}/reports`, options)
		.then(data => data)
	}

	public static verifyProductAdmin = (pid: string, verify: boolean) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				verified: verify
			})
		}

		return this.newFetch(`/products/${pid}`, options)
		.then(data => data)
	}

	public static getProductsReports = (types: ('confirmation'|'rebuttal'|'submission'|'issue')[]) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/jsonm'
			},
			credentials: 'include'
		}

		return this.newFetch(`/reports?resource=products&resolved=null&types=${types.join(',')}`, options)
		.then(data => data.data)
	}

	public static reportProduct = (pid: string, report: AddReport) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...report,
				type: 'issue'
			}),
			credentials: 'include'
		}

		return this.newFetch(`/products/${pid}/reports`, options)
		.then(data => data)
	}

	public static editProductReport = (rid: number, pid: number, action: boolean) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				resolved: action
			}),
			credentials: 'include'
		}

		return this.newFetch(`/products/${pid}/reports/${rid}`, options)
		.then(data => data)
	}

	public static getReportsStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/reports/stats?types=issue', options)
		.then(data => data.data)
	}

	public static getReviews = (cid: string) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reviews`, options)
		.then(data => data.data)
	}

	public static getUserReview = (cid: string) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reviews/me`, options)
		.then(data => data.data)
	}

	public static addReview = (cid: string, body: { content: string, positive: boolean }) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body),
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reviews`, options)
		.then(data => data)
	}

	public static editReview = (cid: string, rid: number, body: { content: string, positive: boolean, visibility?: 'public'|'private' }) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body),
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reviews/${rid}`, options)
		.then(data => data)
	}

	public static likeReview = (cid: number, rid: number, like: boolean|null) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				positive: like
			}),
			credentials: 'include'
		}

		return this.newFetch(`/commerces/${cid}/reviews/${rid}/vote`, options)
		.then(data => data)
	}

	public static getPosts = (page: string|null) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/posts${page ? `?page=${page}` : ''}`, options)
		.then(data => data.data)
	}

	public static getPost = (id: number) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/posts/${id}`, options)
		.then(data => data.data)
	}

	public static getPostsStats = () => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch('/posts/stats', options)
		.then(data => data.data)
	}

	public static addPost = (newPost: NewPost) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newPost),
			credentials: 'include'
		}

		return this.newFetch('/posts', options)
		.then(data => data)
	}

	public static editPost = (pid: string, editPost: EditPost) => {
		const parsePost = Object.fromEntries(Object.entries(editPost).filter(([, value]) => value !== undefined))
		
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(parsePost),
			credentials: 'include'
		}

		return this.newFetch(`/posts/${pid}`, options)
		.then(data => data.data)
	}

	public static deletePost = (pid: string) => {
		const options: RequestInit = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/posts/${pid}`, options)
		.then(data => data)
	}

	public static getComments = (id: number, page: string|null) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/posts/${id}/comments${page ? `?page=${page}` : ''}`, options)
		.then(data => data.data)
	}

	public static getComment = (pid: number, cid: number) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}

		return this.newFetch(`/posts/${pid}/comments/${cid}`, options)
		.then(data => data.data)
	}

	public static addComment = (pid: number, content: string, replyingTo?: number) => {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				content,
				replyingTo
			}),
			credentials: 'include'
		}

		return this.newFetch(`/posts/${pid}/comments`, options)
		.then(data => data.data)
	}

	public static likePost = (id: number, like: boolean|null) => {
		const options: RequestInit = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				positive: like
			}),
			credentials: 'include'
		}

		return this.newFetch(`/posts/${id}/vote`, options)
		.then(data => data)
	}

	private static uploadImage = (image: File) => {
		const formData = new FormData()
		formData.append('file', image)
		
		const options: RequestInit = {
			method: 'POST',
			body: formData,
			credentials: 'include'
		}

		return this.newFetch('/images', options)
		.then(data => data)
	}

	public static uploadImages = (images: File[]|(File|string)[]) => {
		return Promise.all(
			images.map(image => {
				return new Promise((res, rej) => {
					if (typeof image === 'string') return res(image)
					
					return this.uploadImage(image)
					.then(data => {
						return res(data.data.id)
					}).catch(err => {
						return rej(err.message)
					})
				})
			})
		) as Promise<string[]>
	}

	public static traceRoute = (origin: [number, number], destination: [number, number], profile: 'car'|'bike'|'foot') => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		
		return fetch(`${OSRM_URL}/route/v1/${profile}/${origin.join(',')};${destination.join(',')}.json`, options)
		.then(res => res.json().then(json => {
			if (!res.ok) throw new Error(json.message)

			return json
		})).then(data => {
			console.log(data)
		})
	}

	public static searchAddress = (query: string, near?: LatLngTuple) => {
		const options: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		
		return fetch(`${NOMINATIM_URL}/search?q=${query}${near ? ` ${near.join(',')}` : ''}&format=geocodejson&addressdetails=1`, options)
		.then(res => res.json().then(json => {
			if (!res.ok) throw new Error(json.message)

			return json.features as { geometry: { coordinates: [number, number] }, properties: { geocoding: { name?: string, street?: string, city: string, postcode: number, housenumber?: string, osm_value: string, state: string } } }[]
		}))
	}
}

export default Api