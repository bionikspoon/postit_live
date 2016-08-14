// import './styles.scss';
import styles from './styles.scss';
const debug = require('debug')('app:index.bootstrap');  // eslint-disable-line no-unused-vars
debug('styles', styles);
if (process.env.NODE_ENV === 'local') localStorage.setItem('debug', 'app:*,-app:utils:socket');
else localStorage.removeItem('debug');
