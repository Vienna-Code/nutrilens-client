import { create } from 'zustand'

interface State {
	user: User,
	setUser: (user: User) => void
}

export const useAllStore = create<State>()((set) => ({
	user: undefined,
	setUser: (user) => {
		set({ user })
	}
}))