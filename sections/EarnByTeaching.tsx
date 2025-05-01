"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Video, Calendar, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import Image from 'next/image';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center text-center p-6 glass rounded-xl"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={isInView ? { scale: 1 } : { scale: 0.8 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4 text-primary-400"
      >
        {icon}
      </motion.div>
      <h3 className="heading-sm mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

const EarnByTeaching = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const features = [
    {
      icon: <Video size={24} />,
      title: "Create Micro-Courses",
      description: "Record 10-30 minute skill tutorials that anyone can watch. Perfect for sharing specific techniques.",
    },
    {
      icon: <Calendar size={24} />,
      title: "Book 1-on-1 Sessions",
      description: "Set your availability and rates to offer personalized guidance and earn directly from students.",
    },
    {
      icon: <DollarSign size={24} />,
      title: "Earn Credits & Money",
      description: "Get paid every time someone completes your course or books a session with you.",
    },
  ];

  return (
    <section ref={ref} className="section bg-dark-800 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-radial from-accent-900/20 to-transparent opacity-30"></div>
      <div className="absolute top-0 right-0 w-2/3 h-1/3 bg-gradient-radial from-primary-900/10 to-transparent opacity-40"></div>
      
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 inline-block"
            >
              <span className="px-4 py-1 rounded-full glass text-white/80 text-sm font-medium">
                Monetize Your Skills
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-lg text-center mb-6"
            >
              Earn By Teaching What You Know
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-16"
            >
              SkillPod makes it easy to teach and earn.
            </motion.p>

            <Button 
              size="lg"
              onClick={() => {
                const waitlistSection = document.getElementById('waitlist');
                if (waitlistSection) {
                  waitlistSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Become a Teacher
            </Button>
          </motion.div>
          
          <div className="lg:w-1/2">
            <div className="relative rounded-xl overflow-hidden mb-6 premium-card p-4">
              <div className="aspect-video relative">
                <Image
                  src="/assets/skillshare.png"
                  alt="Teaching on SkillPod"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarnByTeaching; 