"use client";

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { useWaitlist } from '@/utils/WaitlistContext';

const Hero = () => {
  const ref = useRef(null);
  const { waitlistCount } = useWaitlist();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Motion values for illuminators
  const illuminator1X = useMotionValue(0);
  const illuminator1Y = useMotionValue(0);
  const illuminator2X = useMotionValue(0);
  const illuminator2Y = useMotionValue(0);
  const illuminator3X = useMotionValue(0);
  const illuminator3Y = useMotionValue(0);

  // Spring animations for smoother movement
  const springConfig = { stiffness: 100, damping: 30 };
  const illuminator1XSpring = useSpring(illuminator1X, springConfig);
  const illuminator1YSpring = useSpring(illuminator1Y, springConfig);
  const illuminator2XSpring = useSpring(illuminator2X, springConfig);
  const illuminator2YSpring = useSpring(illuminator2Y, springConfig);
  const illuminator3XSpring = useSpring(illuminator3X, springConfig);
  const illuminator3YSpring = useSpring(illuminator3Y, springConfig);

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Format the number with commas
  const formattedCount = waitlistCount.toLocaleString();

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-dark-900 to-dark-800 pt-20 pb-16">
      {/* Hero background image with overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image 
          src="/assets/hero.png"
          alt="SkillSwap Hero"
          fill
          priority
          className="object-cover opacity-30"
          style={{ filter: 'brightness(0.7)' }}
        />
        
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-800/90"></div>
        
        {/* Illumination overlays that follow floating elements */}
        <motion.div 
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ 
            x: illuminator1XSpring, 
            y: illuminator1YSpring,
            background: 'radial-gradient(circle, rgba(126, 66, 245, 0.15) 0%, rgba(0,0,0,0) 70%)',
            mixBlendMode: 'soft-light',
          }}
        />
        
        <motion.div 
          className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ 
            x: illuminator2XSpring, 
            y: illuminator2YSpring,
            background: 'radial-gradient(circle, rgba(245, 110, 66, 0.15) 0%, rgba(0,0,0,0) 70%)',
            mixBlendMode: 'soft-light',
          }}
        />
        
        <motion.div 
          className="absolute w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ 
            x: illuminator3XSpring, 
            y: illuminator3YSpring,
            background: 'radial-gradient(circle, rgba(66, 245, 173, 0.15) 0%, rgba(0,0,0,0) 70%)',
            mixBlendMode: 'soft-light',
          }}
        />
      </div>
      
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full bg-primary-500/20 blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          onUpdate={(latest) => {
            // Update illuminator position to follow this element
            illuminator1X.set(Number(latest.x) + window.innerWidth * 0.65);  
            illuminator1Y.set(Number(latest.y) + window.innerHeight * 0.2);
          }}
        />
        <motion.div 
          className="absolute bottom-[15%] left-[10%] w-72 h-72 rounded-full bg-secondary-500/20 blur-3xl"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 15, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          onUpdate={(latest) => {
            // Update illuminator position to follow this element
            illuminator2X.set(Number(latest.x) + window.innerWidth * 0.1);  
            illuminator2Y.set(Number(latest.y) + window.innerHeight * 0.85);
          }}
        />
        <motion.div 
          className="absolute top-[40%] left-[25%] w-48 h-48 rounded-full bg-accent-500/20 blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, 40, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
          onUpdate={(latest) => {
            // Update illuminator position to follow this element
            illuminator3X.set(Number(latest.x) + window.innerWidth * 0.25);  
            illuminator3Y.set(Number(latest.y) + window.innerHeight * 0.4);
          }}
        />
      </div>

      <motion.div 
        style={{ opacity, scale, y }}
        className="container relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1 rounded-full bg-dark-700/70 text-primary-400 border border-primary-700/30 text-sm font-medium">
              Future of Skill Sharing
            </span>
          </motion.div>
          
          <h1 className="heading-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 mb-6">
            Turn Your Skills Into Income
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-lg md:text-xl text-primary-200 font-medium italic mb-2">
              Have you been mastering a skill that others would pay to learn?
            </p>
            <p className="text-xl md:text-2xl text-gray-100 mb-4 max-w-3xl mx-auto">
              Whether you're a coding wizard, design guru, or cooking expert...
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Join early users of SkillSwap — where your knowledge becomes real income.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <span className="bg-dark-800/50 px-4 py-2 rounded-full text-primary-300 text-sm backdrop-blur-sm">
              🎨 Want to monetize your design skills?
            </span>
            <span className="bg-dark-800/50 px-4 py-2 rounded-full text-accent-300 text-sm backdrop-blur-sm">
              👨‍🍳 Love to cook and want to teach?
            </span>
            <span className="bg-dark-800/50 px-4 py-2 rounded-full text-secondary-300 text-sm backdrop-blur-sm">
              💻 Tech skills collecting dust?
            </span>
          </motion.div>
          
          {/* Waitlist count */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-dark-700/70 backdrop-blur-sm border border-primary-600/30 rounded-lg py-2 px-4 text-sm flex items-center">
              <Users size={16} className="text-primary-400 mr-2" />
              <span className="text-gray-300">
                <span className="text-primary-300 font-semibold">{formattedCount}</span> people on waitlist
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button size="lg" onClick={scrollToWaitlist}>
              Join the Waitlist
            </Button>
            <Button variant="secondary" size="lg" onClick={scrollToWaitlist}>
              Start Teaching & Earning
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative floating elements - now with glowing effect */}
      <motion.div 
        className="absolute top-1/4 right-[10%] w-16 h-16 rounded-xl border border-primary-500/50 bg-primary-900/60 backdrop-blur-md shadow-lg shadow-primary-500/30 z-1 glow-primary"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          boxShadow: '0 0 15px 5px rgba(126, 66, 245, 0.15)'
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-[15%] w-12 h-12 rounded-full border border-accent-500/50 bg-accent-900/60 backdrop-blur-md shadow-lg shadow-accent-500/30 z-1 glow-accent"
        animate={{ 
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        style={{
          boxShadow: '0 0 15px 5px rgba(66, 245, 173, 0.15)'
        }}
      />
      <motion.div 
        className="absolute top-[60%] right-[20%] w-10 h-10 rounded-lg border border-secondary-500/50 bg-secondary-900/60 backdrop-blur-md shadow-lg shadow-secondary-500/30 z-1 glow-secondary"
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
        style={{
          boxShadow: '0 0 15px 5px rgba(245, 110, 66, 0.15)'
        }}
      />
    </section>
  );
};

export default Hero; 