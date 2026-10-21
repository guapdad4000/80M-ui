import { lazy, Suspense, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import App from './App.jsx';

const PortalPage = lazy(() => import('./PortalPage.jsx'));
const BookingPage = lazy(() => import('./booking/BookingPage.jsx'));
const CanairyPage = lazy(() => import('./canairy/CanairyPage.jsx'));
const Tone2Page = lazy(() => import('./tone2/Tone2Page.jsx'));

const match = (pathname, base) => pathname === base || pathname.startsWith(`${base}/`);

function RouteFallback() {
  return <div className="min-h-screen bg-[#050505]" aria-busy="true" />;
}

export default function SiteRouter() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  let Page = null;
  if (match(pathname, '/book')) Page = BookingPage;
  else if (match(pathname, '/portal')) Page = PortalPage;
  else if (match(pathname, '/canairy')) Page = CanairyPage;
  else if (match(pathname, '/tone2')) Page = Tone2Page;
  if (!Page) return <App />;
  return <Suspense fallback={<RouteFallback />}><Page /></Suspense>;
}
