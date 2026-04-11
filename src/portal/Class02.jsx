import React from 'react';
import { Link } from 'react-router-dom';

// Stub placeholder for Class 02 course content.
// Full course content will be migrated from PortalPage.jsx.
const Class02 = () => {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Class 02</p>
      <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase mb-4">
        Class 02<br/><span className="italic text-[#22c55e]">Course</span>
      </h1>
      <p className="font-serif text-xl text-[#333] leading-relaxed mb-8">
        This page is under construction — course content will be migrated here.
      </p>
      <div className="border-[3px] border-[#f59e0b] bg-[#fffbeb] p-6 shadow-[6px_6px_0_0_#111]">
        <p className="font-sans font-black uppercase text-sm mb-2">Coming Soon</p>
        <p className="font-serif text-[#444]">
          The full Class 02 course content will be moved here as a proper portal route. For now, use the existing <Link to="/portal" className="underline font-bold">Portal Home</Link> to navigate.
        </p>
      </div>
    </div>
  );
};

export default Class02;
