"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Users, Zap } from 'lucide-react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="premium-card group hover:border-primary-600/30"
    >
      <div className="relative p-6">
        {/* Subtle glow effect on hover */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary-600/0 to-accent-500/0 opacity-0 group-hover:from-primary-600/10 group-hover:to-accent-500/10 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
        
        <div className="relative z-10">
          <div className="text-accent-400 mb-4 group-hover:text-accent-300 transition-colors duration-300">{icon}</div>
          <h3 className="heading-sm mb-2 text-white group-hover:text-accent-100 transition-colors duration-300">{title}</h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Decentralized = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const values = [
    {
      icon: <ShieldCheck size={30} />,
      title: "Transparent Credits",
      description: "Every interaction is tracked fairly. Your contributions are recognized and rewarded directly.",
    },
    {
      icon: <Users size={30} />,
      title: "No Middlemen",
      description: "Connect directly with learners and teachers. We don't stand in the way of genuine skill sharing.",
    },
    {
      icon: <Zap size={30} />,
      title: "Fair to Everyone",
      description: "Real-world teachers and everyday experts can finally get the recognition they deserve.",
    },
  ];

  return (
    <section ref={ref} className="section bg-gradient-to-b from-dark-900 to-dark-800 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.4, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary-900/5 rounded-full blur-[80px]"
      />
      
      <motion.div 
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-secondary-900/5 rounded-full blur-[100px]"
      />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block"
          >
            <span className="px-4 py-1 rounded-full glass text-accent-300 text-sm font-medium">
              Platform Features
            </span>
          </motion.div>
          
          <h2 className="heading-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400">
            Decentralized & Fair
          </h2>
          <p className="text-lg text-gray-400 pb-8 mb-8 max-w-2xl">
            SkillPod is built on the belief that knowledge should be accessible and teaching should be rewarding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              icon={value.icon}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 premium-card p-8 md:p-10 max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-dark-700 border border-accent-700/30">
              <Zap size={28} className="text-accent-400" />
            </div>
          </div>
          <h3 className="heading-md mb-4 text-white">A Genuinely Better Way to Learn & Teach</h3>
          <p className="text-lg text-gray-400">
            We're building a platform that respects both learners and teachers. No more endless subscriptions 
            or unfair algorithms. Just people helping people grow their skills.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Decentralized; 