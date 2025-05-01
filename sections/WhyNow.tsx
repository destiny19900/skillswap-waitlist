"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '@/components/ui/Button';

const WhyNow = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      }
    })
  };

  return (
    <section ref={ref} className="section bg-dark-800 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-900/5 via-dark-800 to-dark-800"></div>
      
      {/* Floating elements */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-20 right-[20%] w-32 h-32 bg-accent-900/10 rounded-full blur-[80px]"
      />
      
      <motion.div
        animate={{ 
          x: [0, 15, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        className="absolute bottom-40 left-[10%] w-40 h-40 bg-primary-900/10 rounded-full blur-[80px]"
      />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block"
            >
              <span className="px-4 py-1 rounded-full glass text-white/80 text-sm font-medium">
                Our Vision
              </span>
            </motion.div>
            
            <motion.h2 
              variants={textVariants} 
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="heading-lg text-center mb-16"
            >
              Why SkillPod? Why Now?
            </motion.h2>
            
            <div className="space-y-8 mb-12">
              <motion.p 
                custom={0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={textVariants}
                className="text-xl text-gray-300"
              >
                <span className="font-bold text-white">People are tired of boring learning.</span> Traditional platforms 
                don't capture the magic of learning from someone who's truly passionate.
              </motion.p>
              
              <motion.p 
                custom={1}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={textVariants}
                className="text-xl text-gray-300"
              >
                <span className="font-bold text-white">Real humans teaching real things — finally.</span> Not corporate 
                trainings or AI-generated lessons, but genuine experts sharing their authentic knowledge.
              </motion.p>
              
              <motion.p 
                custom={2}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={textVariants}
                className="text-xl text-gray-300"
              >
                <span className="font-bold text-white">Learning should feel like hanging out with a friend</span> who's 
                really good at something — and excited to show you how it's done.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 premium-card p-8 md:p-12 relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-700/20 via-primary-700/20 to-secondary-700/20 blur opacity-70"></div>
              
              <div className="relative z-10">
                <h3 className="heading-md mb-4 text-white">Ready to join the revolution?</h3>
                <p className="text-lg mb-6 text-gray-300">
                  Be one of the first to experience a better way to learn and teach.
                </p>
                <Button size="lg">Join the Waitlist</Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyNow; 