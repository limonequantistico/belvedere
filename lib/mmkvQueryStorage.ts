import { MMKV } from 'react-native-mmkv';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Initialize a dedicated MMKV instance for React Query cache
export const queryClientStorage = new MMKV({
  id: 'react-query-cache',
});

// Create the actual persister for TanStack Query using the synchronous MMKV engine
export const asyncStoragePersister = createSyncStoragePersister({
  storage: {
    getItem: (key) => queryClientStorage.getString(key) ?? null,
    setItem: (key, value) => queryClientStorage.set(key, value),
    removeItem: (key) => queryClientStorage.delete(key),
  },
});
