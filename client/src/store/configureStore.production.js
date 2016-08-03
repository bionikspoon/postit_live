import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import socketMiddleware from '../middleware/socket';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

export default function configureStore(initialState) {
  const middlewares = [thunkMiddleware, routerMiddleware(browserHistory), socketMiddleware];
  const middleware = applyMiddleware(...middlewares);
  const enhancer = compose(middleware);

  return createStore(rootReducer, initialState, enhancer);
}
