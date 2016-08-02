import { combineReducers } from 'redux';
import live from './live';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({ live, routing: routerReducer });

export default rootReducer;
