import { create } from 'zustand';
import * as Location from 'expo-location';

type LocationState = {
  location: Location.LocationObject | null;
  permissionStatus: Location.PermissionStatus | null;
  errorMsg: string | null;
  isLoading: boolean;
  requestLocation: () => Promise<void>;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  permissionStatus: null,
  errorMsg: null,
  isLoading: false,

  requestLocation: async () => {
    set({ isLoading: true, errorMsg: null });
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      set({ permissionStatus: status });
      
      if (status !== 'granted') {
        set({ 
          errorMsg: 'Permission to access location was denied',
          isLoading: false 
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      set({ location, isLoading: false });
    } catch (error) {
      set({ 
        errorMsg: error instanceof Error ? error.message : 'Error fetching location',
        isLoading: false 
      });
    }
  },
}));
