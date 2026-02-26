import { create } from 'zustand';

interface AuthModalState {
  isVisible: boolean;
  message: string;
  showModal: (message?: string) => void;
  hideModal: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isVisible: false,
  message: 'You need to be logged in to do this.',
  showModal: (message) => set({ isVisible: true, message: message || 'You need to be logged in to do this.' }),
  hideModal: () => set({ isVisible: false }),
}));
