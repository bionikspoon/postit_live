import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import { persistState } from 'redux-devtools';
import DevTools from '../containers/DevTools';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

export default function configureStore(initialState) {
  const middlewares = [reduxImmutableStateInvariant()];
  const middleware = applyMiddleware(...middlewares);

  const getDebugSessionKey = () => {
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length) ? matches[1] : null;
  };
  const enhancer = compose(
    middleware,
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    // DevTools.instrument(),
    persistState(getDebugSessionKey())
  );

  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
