import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import App from './App.jsx';
import PortalPage from './PortalPage.jsx';
import BookingPage from './booking/BookingPage.jsx';
import CanairyPage from './canairy/CanairyPage.jsx';

export default function SiteRouter() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  if (pathname === '/book' || pathname.startsWith('/book/')) return <BookingPage />;
  if (pathname === '/portal' || pathname.startsWith('/portal/')) return <PortalPage />;
  if (pathname === '/canairy' || pathname.startsWith('/canairy/')) return <CanairyPage />;
  return <App />;
}
