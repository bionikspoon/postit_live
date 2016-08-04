import './styles.scss';

if (process.env.NODE_ENV === 'local') localStorage.setItem('debug', 'app:*');
else localStorage.removeItem('debug');
