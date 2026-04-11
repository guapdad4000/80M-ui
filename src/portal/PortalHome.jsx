import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PaperBackground } from '../PortalShared';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const PortalHome = () => {
  const courses = [
    {
      number: '04',
      title: 'Content Forge',
      tagline: 'The Ghost in the TikTok Machine',
      desc: 'Your AI posts for you. While you sleep. Your phone thinks a human is doing it. TikTok never knows the difference.',
      path: '/portal/class-04',
      status: 'available',
      icon: '👻',
    },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      <PaperBackground />
      <div className="relative z-10">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// 80M Portal — Master Index</p>
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase">
            The<br/><span className="italic text-[#22c55e]">80M Lab</span>
          </h1>
          <p className="font-serif text-xl text-[#333] leading-relaxed mt-4 max-w-xl">
            Your AI-powered training environment. Navigate the curriculum, track your progress, and deploy the system — one class at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <motion.div key={course.number} variants={fadeUp}>
              <Link
                to={course.path}
                className="group block border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111] hover:shadow-[10px_10px_0_0_#22c55e] hover:border-[#22c55e] transition-all p-6 md:p-8"
              >
                <div className="text-4xl mb-4">{course.icon}</div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#22c55e]">
                  Class {course.number}
                </span>
                <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mt-1 mb-2">
                  {course.title}
                </h3>
                <p className="font-serif text-[#555] text-sm leading-relaxed italic mb-4">
                  "{course.tagline}"
                </p>
                <p className="font-serif text-[#333] text-base leading-relaxed">
                  {course.desc}
                </p>
                <div className="mt-6 font-sans font-black text-sm uppercase px-4 py-3 bg-[#111] text-[#eae7de] group-hover:bg-[#22c55e] group-hover:text-[#111] transition-colors inline-block">
                  Enter Class →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PortalHome;
