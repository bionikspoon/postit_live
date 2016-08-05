import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunkMiddleware from 'redux-thunk';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import socketMiddleware from '../middleware/socket';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';

export default function configureStore(initialState) {
  const middleware = applyMiddleware(
    thunkMiddleware,
    reduxImmutableStateInvariant(),
    routerMiddleware(browserHistory),
    socketMiddleware,
    createLogger({ duration: true, collapsed: true, diff: true, predicate: ignore('redux-form') })
  );

  const getDebugSessionKey = () => {
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length) ? matches[1] : null;
  };
  const enhancer = compose(
    middleware,
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
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

function ignore(predicate) {
  return (_, action) => !action.type.startsWith(predicate);
}
