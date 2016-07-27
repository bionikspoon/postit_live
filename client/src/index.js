import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes';
import configureStore from './store/configureStore';

const STORE = configureStore();
const ROOT_ELEMENT = 'main';

// handle client side rendering
if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Provider store={STORE}>
      <div>
        <Router history={browserHistory} routes={routes} />
      </div>
    </Provider>,
    document.getElementById(ROOT_ELEMENT)
  );
}
