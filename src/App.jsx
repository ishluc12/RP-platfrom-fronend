import { useEffect, useState } from 'react';
import Api from './services/api';
import './index.css';

function Header({ user, onLogout }) {
  return (
    <header className="app-header">
      <div className="brand">RP Platform</div>
      <nav>
        <a href="#/">Home</a>
        <a href="#/dashboard">Dashboard</a>
        <a href="#/events">Events</a>
        <a href="#/posts">Posts</a>
        <a href="#/forums">Forums</a>
      </nav>
      <div className="auth">
        {user ? (
          <>
            <span className="user-name">{user?.name || user?.email}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <a href="#/login" className="btn">Login</a>
        )}
      </div>
    </header>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await Api.auth.login({ email, password });
      const token = res?.data?.token || res?.token;
      const user = res?.data?.user || res?.user;
      if (token) {
        localStorage.setItem('token', token);
      }
      onLogin(user || null);
      window.location.hash = '#/dashboard';
    } catch (err) {
      setError(err?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <p className="hint">Demo only. Actual UI should follow the PDF design (see Final year project.pdf in the repository root).</p>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await Api.student.dashboard.summary();
        setSummary(data?.data || data || null);
      } catch (err) {
        setError(err?.data?.message || err.message || 'Failed to load dashboard');
      }
    })();
  }, []);

  return (
    <div className="page">
      <h2>Dashboard</h2>
      {error && <div className="error">{error}</div>}
      <pre className="code-block">{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}

function Events() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.shared.events.list();
        const items = Array.isArray(res) ? res : (res?.data || res?.events || []);
        setItems(items);
      } catch (err) {
        setError(err?.data?.message || err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page">
      <h2>Events</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul className="list">
        {items.map((ev) => (
          <li key={ev.id || ev._id} className="card">
            <div className="title">{ev.title || ev.name}</div>
            <div className="meta">{ev.date ? new Date(ev.date).toLocaleString() : ''}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Posts() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.shared.posts.feed();
        const items = Array.isArray(res) ? res : (res?.data || res?.posts || []);
        setItems(items);
      } catch (err) {
        setError(err?.data?.message || err.message || 'Failed to load posts');
      }
    })();
  }, []);

  return (
    <div className="page">
      <h2>Posts</h2>
      {error && <div className="error">{error}</div>}
      <ul className="list">
        {items.map((p) => (
          <li key={p.id || p._id} className="card">
            <div className="title">{p.title}</div>
            <div className="body">{p.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Forums() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.shared.forums.list();
        const items = Array.isArray(res) ? res : (res?.data || res?.forums || []);
        setItems(items);
      } catch (err) {
        setError(err?.data?.message || err.message || 'Failed to load forums');
      }
    })();
  }, []);

  return (
    <div className="page">
      <h2>Forums</h2>
      {error && <div className="error">{error}</div>}
      <ul className="list">
        {items.map((f) => (
          <li key={f.id || f._id} className="card">
            <div className="title">{f.title || f.name}</div>
            <div className="body">{f.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Home() {
  return (
    <div className="page">
      <h2>Welcome</h2>
      <p>This is a starter shell for the frontend. Replace with the exact UI from the PDF (Final year project.pdf) located in the project.</p>
    </div>
  );
}

function Router({ route, onLogin }) {
  if (route === '#/login') return <Login onLogin={onLogin} />;
  if (route === '#/dashboard') return <Dashboard />;
  if (route === '#/events') return <Events />;
  if (route === '#/posts') return <Posts />;
  if (route === '#/forums') return <Forums />;
  return <Home />;
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await Api.auth.profile.get();
        setUser(me?.data || me || null);
      } catch (_) {
        // not logged in
      }
    })();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    window.location.hash = '#/login';
  }

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      <main>
        <Router route={route} onLogin={setUser} />
      </main>
    </div>
  );
}
