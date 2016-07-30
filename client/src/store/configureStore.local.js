import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunkMiddleware from 'redux-thunk';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import socketMiddleware from '../middleware/socket';

export default function configureStore(initialState) {
  const middlewares = [thunkMiddleware, reduxImmutableStateInvariant(), socketMiddleware];
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
