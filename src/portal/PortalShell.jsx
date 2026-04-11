import React from 'react';
import { Outlet, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NoiseOverlay } from '../PortalShared';
import { CourseFourContent } from '../PortalPage';
import PortalHome from './PortalHome';

const PORTAL_ROUTES = [
  { path: '/portal', label: 'Portal Home' },
  { path: '/portal/class-04', label: 'Class 04: Content Forge' },
];

const PortalNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const current = PORTAL_ROUTES.find(r => location.pathname === r.path) || PORTAL_ROUTES[0];

  return (
    <>
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">80M Portal</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">{current.label}</h2>
        </div>
        <button
          onClick={() => navigate('/')}
          className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all"
        >
          Exit Portal ✕
        </button>
      </div>
    </>
  );
};

const PortalShellContent = () => {
  return (
    <Routes>
      <Route index element={<PortalHome />} />
      <Route path="class-04" element={<CourseFourContent onClose={() => window.location.href = '/portal'} />} />
    </Routes>
  );
};

const PortalShell = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col"
    >
      <PortalNav />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </div>
    </motion.div>
  );
};

export { PortalNav, PortalShellContent };
export default PortalShell;
