import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const middleware = applyMiddleware();
  const enhancer = compose(middleware);

  return createStore(rootReducer, initialState, enhancer);
}
