import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './pages/Dashboard'; // Import the new Dashboard page
import Api from './services/api'; // Import Api for profile check
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const me = await Api.auth.profile.get();
          setUser(me?.data || me || null);
        }
      } catch (_) {
        // not logged in or token invalid
        localStorage.removeItem('token');
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
    window.location.hash = '#/dashboard';
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    window.location.hash = '#/login';
  }

  if (loadingUser) {
    return <div className="flex items-center justify-center min-h-screen text-gray-700">Loading user session...</div>;
  }

  return (
    <div className="app min-h-screen bg-blue-500">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} route={route} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} route={route} />
      )}
    </div>
  );
}
