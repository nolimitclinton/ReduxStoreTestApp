type Action = { type: string } & Record<string, any>;
type Reducer<S> = (currentState: S, action: Action) => S;

export function createStore<S extends Record<string, any>>(
  initialState: S,
  reducer: Reducer<S>
) {
  let state = initialState;
  let listeners: (() => void)[] = [];

  function getState() {
    return state;
  }

  function dispatch(action: Action) {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }

  return { getState, dispatch, subscribe };
}