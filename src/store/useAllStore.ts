import type { LatLng } from 'leaflet'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
	user: User,
	commerces: Commerce[],
	locate: boolean,
	located: boolean,
	userLocation?: LatLng,
	selectedCommerce?: string,
	unverifiedCommerces: boolean,
	unverifiedProducts: boolean,
	setUser: (user: User) => void,
	setCommerces: (commerces: Commerce[]) => void,
	setLocate: (locate: boolean) => void,
	setLocated: (located: boolean) => void,
	setUserLocation: (userLocation: LatLng) => void,
	setSelectedCommerce: (id?: string) => void,
	setUnverifiedCommerces: (unverifiedCommerces: boolean) => void,
	setUnverifiedProducts: (unverifiedProducts: boolean) => void
}

export const useAllStore = create<State>()(persist((set) => ({
	user: undefined,
	commerces: [],
	locate: false,
	located: false,
	userLocation: undefined,
	selectedCommerce: undefined,
	unverifiedCommerces: true,
	unverifiedProducts: true,
	setUser: (user) => {
		set({ user })
	},
	setCommerces: (commerces) => {
		set({ commerces })
	},
	setLocate: (locate) => {
		set({ locate })
	},
	setLocated: (located) => {
		set({ located })
	},
	setUserLocation: (userLocation) => {
		set({ userLocation })
	},
	setSelectedCommerce: (selectedCommerce) => {
		set({ selectedCommerce })
	},
	setUnverifiedCommerces: (unverifiedCommerces) => {
		set({ unverifiedCommerces })
	},
	setUnverifiedProducts: (unverifiedProducts) => {
		set({ unverifiedProducts })
	}
}), {
	name: 'nutrilens-store',
	partialize: state => ({
		unverifiedCommerces: state.unverifiedCommerces,
		setUnverifiedProducts: state.unverifiedProducts
	})
}))