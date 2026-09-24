import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Hook to safely detect if the component is rendered on client vs server.
 * Uses React 18/19 `useSyncExternalStore` to avoid cascading render lint errors
 * and prevent SSR hydration mismatch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
