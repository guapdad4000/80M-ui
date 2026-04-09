import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import PortalPage from './PortalPage.jsx';

function Router() {
  const location = useLocation();
  if (location.pathname === '/portal') {
    return <PortalPage />;
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
