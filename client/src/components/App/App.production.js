import React from 'react';
import { Router, browserHistory } from 'react-router';
import routes from '../../routes';

export default function App() {
  return (
    <main>
      <Router history={browserHistory} routes={routes} />
    </main>
  );
}

App.propTypes = {};
