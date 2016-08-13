import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import middlewarePromise from 'redux-promise';
import middlewareThunk from 'redux-thunk';
import rootReducer from '../modules';
import middlewareSocket from '../middleware/socket';

export default function configureStore(initialState) {
  const middleware = applyMiddleware(
    middlewarePromise,
    middlewareThunk,
    routerMiddleware(browserHistory),
    middlewareSocket
  );
  const enhancer = compose(middleware);

  return createStore(rootReducer, initialState, enhancer);
}
