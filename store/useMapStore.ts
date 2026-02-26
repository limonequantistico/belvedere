import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'map-preferences' });

type CameraPosition = {
  centerCoordinate: [number, number];
  zoomLevel: number;
  pitch: number;
  heading: number;
  padding?: {
    paddingBottom?: number;
    paddingTop?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
};

// Initial camera position (Rome, Italy - as a fallback)
const DEFAULT_CAMERA_POSITION: CameraPosition = {
  centerCoordinate: [12.4964, 41.9028],
  zoomLevel: 5, // zoom out a bit for the fallback
  pitch: 0,
  heading: 0,
};

type MapState = {
  cameraPosition: CameraPosition;
  selectedViewpointId: string | null;
  activeCategory: string | null;
  searchQuery: string;
  verifiedOnly: boolean;
  mapStyle?: string; // Stored persistently
  
  // Actions
  setCameraPosition: (position: Partial<CameraPosition>) => void;
  setSelectedViewpoint: (id: string | null) => void;
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setVerifiedOnly: (verified: boolean) => void;
  setMapStyle: (style: string) => void;
  resetFilters: () => void;
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      cameraPosition: DEFAULT_CAMERA_POSITION,
      selectedViewpointId: null,
      activeCategory: null,
      searchQuery: '',
      verifiedOnly: false,
      mapStyle: undefined, // Let index.tsx fallback to theme if undefined

      setCameraPosition: (position) =>
        set((state) => ({
          cameraPosition: { ...state.cameraPosition, ...position },
        })),
      setSelectedViewpoint: (id) => set({ selectedViewpointId: id }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setVerifiedOnly: (verified) => set({ verifiedOnly: verified }),
      setMapStyle: (style) => set({ mapStyle: style }),
      resetFilters: () => set({ activeCategory: null, searchQuery: '', verifiedOnly: false }),
    }),
    {
      name: 'map-storage', // key in storage
      storage: createJSONStorage(() => ({
        setItem: (name, value) => {
          return storage.set(name, value);
        },
        getItem: (name) => {
          const value = storage.getString(name);
          return value ?? null;
        },
        removeItem: (name) => {
          return storage.delete(name);
        },
      })),
      partialize: (state) => ({ mapStyle: state.mapStyle }), // we only want to persist mapStyle
    }
  )
);
