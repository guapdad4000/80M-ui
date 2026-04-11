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

const courses = [
  {
    number: '01',
    title: 'Install the Stack',
    tagline: 'From Zero to Alive',
    desc: 'Your AI posts for you. While you sleep. Your phone thinks a human is doing it. TikTok never knows the difference.',
    path: '/portal/class-01',
    status: 'stub',
    icon: '🧠',
  },
  {
    number: '02',
    title: 'Class 02',
    tagline: 'Course',
    desc: 'Under construction — course content will be available here.',
    path: '/portal/class-02',
    status: 'stub',
    icon: '⚙️',
  },
  {
    number: '03',
    title: 'Class 03',
    tagline: 'Course',
    desc: 'Under construction — course content will be available here.',
    path: '/portal/class-03',
    status: 'stub',
    icon: '🌐',
  },
  {
    number: '04',
    title: 'Content Forge',
    tagline: 'The Ghost in the TikTok Machine',
    desc: 'Your AI posts for you. While you sleep. Your phone thinks a human is doing it. TikTok never knows the difference. This is not a growth hack. This is the actual system.',
    path: '/portal/class-04',
    status: 'available',
    icon: '👻',
  },
];

const PortalCourses = () => {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      <PaperBackground />
      <div className="relative z-10">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// 80M Portal — Courses</p>
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase">
            The<br/><span className="italic text-[#22c55e]">Curriculum</span>
          </h1>
          <p className="font-serif text-xl text-[#333] leading-relaxed mt-4 max-w-xl">
            Seven classes from zero to full AI agent deployment. Each class is a complete, executable module. Start anywhere — or start at Class 01.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <motion.div key={course.number} variants={fadeUp}>
              <Link
                to={course.path}
                className={`group block border-[3px] bg-white shadow-[6px_6px_0_0_#111] hover:shadow-[10px_10px_0_0_#22c55e] transition-all p-6 md:p-8 ${
                  course.status === 'available'
                    ? 'border-[#111] hover:border-[#22c55e]'
                    : 'border-[#ddd] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-4">{course.icon}</div>
                  {course.status === 'stub' && (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#fffbeb] text-[#f59e0b] border border-[#f59e0b]">
                      Coming Soon
                    </span>
                  )}
                  {course.status === 'available' && (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#f0fdf4] text-[#22c55e] border border-[#22c55e]">
                      Available
                    </span>
                  )}
                </div>
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
                  {course.status === 'available' ? 'Enter Class →' : 'View Syllabus →'}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 border-[3px] border-[#111] bg-white p-8 shadow-[6px_6px_0_0_#111]">
          <h2 className="font-sans font-black text-2xl uppercase mb-4">Prerequisites</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'C01 — C03', desc: 'Foundation: stack install, agent council, secret tunnel, memory system.' },
              { label: 'C04 — C07', desc: 'Production: TikTok automation, knowledge base, financial agents, chat app.' },
              { label: 'All Classes', desc: 'OpenClaw running, Docker Desktop, one AI model provider.' },
            ].map((item, i) => (
              <div key={i} className="border-l-[4px] border-[#22c55e] pl-4">
                <p className="font-mono text-xs font-bold uppercase text-[#22c55e] mb-1">{item.label}</p>
                <p className="font-serif text-sm text-[#555]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortalCourses;
