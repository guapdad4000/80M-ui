import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import PortalPage from './PortalPage.jsx';
import CanairyPage from './canairy/CanairyPage.jsx';

function Router() {
  const location = useLocation();
  if (location.pathname === '/portal' || location.pathname.startsWith('/portal/')) {
    return <PortalPage />;
  }
  if (location.pathname === '/canairy' || location.pathname.startsWith('/canairy/')) {
    return <CanairyPage />;
  }
  return <App />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
);
