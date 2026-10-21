import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import SiteRouter from './SiteRouter.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <SiteRouter />
    </BrowserRouter>
  </React.StrictMode>
);
