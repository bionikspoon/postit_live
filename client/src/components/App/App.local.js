import React from 'react';
import { Router, browserHistory } from 'react-router';
import DevTools from '../../containers/DevTools';
import routes from '../../routes';

export default function App() {
  return (
    <main>
      <Router history={browserHistory} routes={routes} />
      {window.devToolsExtension ? null : <DevTools />}
    </main>
  );
}

App.propTypes = {};
