import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const middlewares = [thunkMiddleware];
  const middleware = applyMiddleware(...middlewares);
  const enhancer = compose(middleware);

  return createStore(rootReducer, initialState, enhancer);
}
