import { combineReducers } from 'redux';
import counter from './counter';
import live from './live';

const rootReducer = combineReducers({
  counter, live,
});

export default rootReducer;
