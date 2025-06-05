import React, {
    createContext,
    useContext,
    useSyncExternalStore,
  } from 'react';
  import type { Action } from './store';
  
  type Store<S> = {
    getState: () => S;
    dispatch: (action: Action) => void;
    subscribe: (listener: () => void) => () => void;
  };
  
  const StoreContext = createContext<Store<any> | null>(null);
  
  export function StoreProvider<S>({
    store,
    children,
  }: {
    store: Store<S>;
    children: React.ReactNode;
  }) {
    return (
      <StoreContext.Provider value={store}>
        {children}
      </StoreContext.Provider>
    );
  }

  export function useDispatch<S = unknown>(): (action: Action) => void {
    const store = useContext(StoreContext) as Store<S> | null;
    if (!store) throw new Error('useDispatch must be used within StoreProvider');
    return store.dispatch;
  }
  
  export function useStore<T, S = unknown>(
    selector: (state: S) => T
  ): T {
    const store = useContext(StoreContext) as Store<S> | null;
    if (!store) throw new Error('useStore must be used within StoreProvider');
  
    return useSyncExternalStore(
      store.subscribe,
      () => selector(store.getState())
    );
  }