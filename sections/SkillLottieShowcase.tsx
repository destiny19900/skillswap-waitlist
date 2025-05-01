"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface SkillAnimationProps {
  title: string;
  description: string;
  imagePath: string;
  index: number;
}

const SkillAnimation: React.FC<SkillAnimationProps> = ({ 
  title, 
  description, 
  imagePath,
  index
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      className="premium-card p-6 flex flex-col md:flex-row gap-6 items-center"
    >
      <div className="w-full md:w-1/3 h-64 relative rounded-xl overflow-hidden">
        <Image 
          src={imagePath}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="w-full md:w-2/3">
        <h3 className="heading-md mb-4 text-white">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        <Button 
          variant={index % 2 === 0 ? 'primary' : 'accent'}
          onClick={() => {
            const waitlistSection = document.getElementById('waitlist');
            if (waitlistSection) {
              waitlistSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Learn More <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

const SkillLottieShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Using available images since we don't have Lottie animations
  const skillShowcases = [
    {
      title: "Learn Web Development",
      description: "Build responsive websites and web applications with modern frameworks like React, Angular, and Vue.",
      imagePath: "/assets/programming.jpg",
    },
    {
      title: "Master Digital Marketing",
      description: "Learn SEO, social media marketing, PPC, and content strategy from industry professionals.",
      imagePath: "/assets/digital_marketing.jpeg",
    },
    {
      title: "Become a Content Creator",
      description: "Create engaging videos, articles, and social media content that people love.",
      imagePath: "/assets/graphics_design.jpg",
    },
    {
      title: "Machine Learning",
      description: "Learn how to build and train machine learning models using Python and TensorFlow.",
      imagePath: "/assets/ml.jpg",
    },
  ];

  return (
    <section ref={ref} className="section bg-dark-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-900/10 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-900/10 rounded-full blur-[100px]"></div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1 rounded-full glass text-white/80 text-sm font-medium">
              Featured Skills
            </span>
          </motion.div>
          
          <h2 className="heading-lg mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400">
            Skills With High Earning Potential
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            These in-demand skills can help you earn income quickly or transition to a high-growth career.
          </p>
        </motion.div>

        <div className="space-y-8">
          {skillShowcases.map((skill, index) => (
            <SkillAnimation 
              key={skill.title}
              title={skill.title}
              description={skill.description}
              imagePath={skill.imagePath}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillLottieShowcase; 