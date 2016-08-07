import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import rootReducer from '../modules';
import middlewarePromise from 'redux-promise';
import middlewareThunk from 'redux-thunk';
import middlewareSocket from '../middleware/socket';
import DevTools from '../containers/DevTools';

export default function configureStore(initialState) {
  const middleware = applyMiddleware(
    middlewarePromise,
    middlewareThunk,
    reduxImmutableStateInvariant(),
    routerMiddleware(browserHistory),
    middlewareSocket,
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
      store.replaceReducer(require('../reducers').default) // eslint-disable-line global-require
    );
  }

  return store;
}

function ignore(predicate) {
  return (_, action) => !action.type.startsWith(predicate);
}
