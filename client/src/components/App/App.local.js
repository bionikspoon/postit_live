import React, { PropTypes } from 'react';
import { Router, browserHistory } from 'react-router';
import DevTools from '../../containers/DevTools';
import routes from '../../routes';
import { syncHistoryWithStore } from 'react-router-redux';

export default function App({ store }) {
  const history = syncHistoryWithStore(browserHistory, store);
  return (
    <main>
      <Router history={history} routes={routes} />
      {window.devToolsExtension ? null : <DevTools />}
    </main>
  );
}
App.propTypes = {
  store: PropTypes.object.isRequired,
};
