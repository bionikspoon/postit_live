import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers';
import middlewareSocket from '../middleware/socket';

export default function configureStore(initialState) {
  const middleware = applyMiddleware(
    promiseMiddleware,
    routerMiddleware(browserHistory),
    middlewareSocket
  );
  const enhancer = compose(middleware);

  return createStore(rootReducer, initialState, enhancer);
}
