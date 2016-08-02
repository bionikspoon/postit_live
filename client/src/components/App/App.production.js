import React, { PropTypes } from 'react';
import { Router, browserHistory } from 'react-router';
import routes from '../../routes';
import { syncHistoryWithStore } from 'react-router-redux';

export default function App({ store }) {
  const history = syncHistoryWithStore(browserHistory, store);
  return (
    <main>
      <Router history={history} routes={routes} />
    </main>
  );
}
App.propTypes = {
  store: PropTypes.object.isRequired,
};
