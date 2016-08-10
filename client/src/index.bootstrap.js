import './styles.scss';

if (process.env.NODE_ENV === 'local') localStorage.setItem('debug', 'app:*,-app:utils:socket');
else localStorage.removeItem('debug');
