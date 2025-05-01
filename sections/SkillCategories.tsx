"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Lightbulb, Palette, Users } from 'lucide-react';
import Image from 'next/image';

interface SkillCategoryProps {
  icon: React.ReactNode;
  title: string;
  skills: string[];
  index: number;
  backgroundImage?: string;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ icon, title, skills, index, backgroundImage }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="premium-card hover:border-primary-600/30 group"
    >
      <div className="relative p-6">
        {/* Glow effect on hover */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary-600/0 to-accent-500/0 opacity-0 group-hover:from-primary-600/20 group-hover:to-accent-500/20 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
        
        {/* Background image if provided */}
        {backgroundImage && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-dark-900/85 z-10"></div>
            <Image 
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover opacity-20"
            />
          </div>
        )}
      
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-full bg-dark-700 flex items-center justify-center mb-4 text-primary-400 group-hover:text-primary-300 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="heading-sm mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-primary-300 group-hover:to-white transition-all duration-300">
            {title}
          </h3>
          <ul className="space-y-2">
            {skills.map((skill, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05 }}
                className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2" />
                {skill}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const SkillCategories = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const skillCategories = [
    {
      icon: <Code size={26} />,
      title: "Tech & Creator Skills",
      skills: ["HTML & CSS", "Python", "React", "CapCut", "Canva", "GitHub", "Podcasting", "TikTok Editing"],
      backgroundImage: "/assets/programming.jpg"
    },
    {
      icon: <Lightbulb size={26} />,
      title: "Life & Everyday Skills",
      skills: ["Budgeting", "Writing Resumes", "Public Speaking", "Excel", "Job Interview Prep", "Time Management"],
      backgroundImage: "/assets/skill.jpg"
    },
    {
      icon: <Palette size={26} />,
      title: "Crafts & Fun Skills",
      skills: ["Crochet", "Cooking", "Drawing", "Guitar", "Photography", "DIY", "Gardening", "Dance"],
      backgroundImage: "/assets/cooking.jpg"
    },
    {
      icon: <Users size={26} />,
      title: "Book 1-on-1 Sessions",
      skills: ["Personal Tutoring", "Career Mentorship", "Project Feedback", "Portfolio Review", "Live Coaching"],
      backgroundImage: "/assets/graphics_design.jpg"
    },
  ];

  return (
    <section ref={ref} className="section bg-dark-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-2/3 h-1/3 bg-primary-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-accent-900/10 rounded-full blur-[100px]"></div>
      </div>
      
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
            <span className="px-4 py-1 rounded-full glass text-white/80 text-sm font-medium">
              Explore Skills
            </span>
          </motion.div>
          
          <h2 className="heading-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400">
            Discover Skills That Matter
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From everyday essentials to specialized expertise, find the skills that will transform your life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={category.title}
              icon={category.icon}
              title={category.title}
              skills={category.skills}
              index={index}
              backgroundImage={category.backgroundImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillCategories; 