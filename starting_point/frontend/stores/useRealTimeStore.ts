import { create } from 'zustand'

interface RealTimeState {
  token: string
  setToken: (token: string) => void
}

const useRealTimeStore = create<RealTimeState>((set, get) => ({
  token: '',
  setToken: token => set({ token })
}))

export default useRealTimeStore
