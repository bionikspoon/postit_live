import { browserHistory } from 'react-router';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';

export const STORE = configureStore();
export const HISTORY = syncHistoryWithStore(browserHistory, STORE);
