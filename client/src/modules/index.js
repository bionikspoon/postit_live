import { combineReducers } from 'redux';
import live from './live';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
const debug = require('debug')('app:modules:index');  // eslint-disable-line no-unused-vars
const rootReducer = combineReducers({
  live,
  routing,
  form,
});

export default rootReducer;
