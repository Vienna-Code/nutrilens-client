import type { LatLng } from 'leaflet'
import { create } from 'zustand'

interface State {
	user: User,
	setUser: (user: User) => void,
	commerces: Commerce[],
	setCommerces: (commerces: Commerce[]) => void,
	locate: boolean,
	setLocate: (locate: boolean) => void,
	located: boolean,
	setLocated: (located: boolean) => void,
	userLocation?: LatLng,
	setUserLocation: (userLocation: LatLng) => void
}

export const useAllStore = create<State>()((set) => ({
	user: undefined,
	setUser: (user) => {
		set({ user })
	},
	commerces: [],
	setCommerces: (commerces) => {
		set({ commerces })
	},
	locate: false,
	setLocate: (locate) => {
		set({ locate })
	},
	located: false,
	setLocated: (located) => {
		set({ located })
	},
	userLocation: undefined,
	setUserLocation: (userLocation) => {
		set({ userLocation })
	}
}))