import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import DevTools from '../../containers/DevTools';
import routes from '../../routes';
import { HISTORY } from '../../init';

export default function App() {
  return (
    <main>
      <Router history={HISTORY} routes={routes} />

      {window.devToolsExtension ? null : <DevTools />}
    </main>
  );
}
App.propTypes = {};
