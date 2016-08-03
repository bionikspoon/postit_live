import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { STORE } from './init';
const ROOT_ELEMENT = 'main';

// handle client side rendering
if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Provider store={STORE}>
      <App />
    </Provider>,
    document.getElementById(ROOT_ELEMENT)
  );
}
