import React, { useState } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LiveFeed from './pages/LiveFeed';
import Reports from './pages/Reports';

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  if (!user) return <Login onLogin={setUser} />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'live': return <LiveFeed />;
      case 'alerts': return <Alerts />;
      case 'analytics': return <Analytics />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={() => setUser(null)} />
      <main className="flex-1 relative overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
