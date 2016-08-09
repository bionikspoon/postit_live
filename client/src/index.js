import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { STORE } from './init';
const ROOT_ELEMENT = 'main';

// if (process.env.NODE_ENV === 'local') require('react-a11y')(React, { ReactDOM, includeSrcNode: true }); // eslint-disable-line global-require

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Provider store={STORE}><App /></Provider>,
    document.getElementById(ROOT_ELEMENT)
  );
}
