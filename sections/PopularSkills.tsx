"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Brush, BookOpen, Sparkles, Briefcase, Clock } from 'lucide-react';
import Image from 'next/image';

interface SkillCategoryProps {
  title: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
  index: number;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ title, icon, skills, color, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      className="premium-card group cursor-pointer"
    >
      <div className="relative p-6 h-full flex flex-col">
        {/* Glow effect on hover */}
        <div className={`absolute -inset-px rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 ${color}`}></div>

        <div className="relative z-10 flex-1">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${color.replace("from-", "text-").replace("/20 to-", "/80")}`}>
            {icon}
          </div>
          <h3 className="heading-sm mb-4 text-white">{title}</h3>
          <ul className="space-y-2.5">
            {skills.map((skill, idx) => (
              <motion.li
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: index * 0.2 + idx * 0.1 }}
                className="flex items-center text-gray-400 group-hover:text-gray-300"
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${color.replace("from-", "bg-").split(' ')[0]}`} />
                {skill}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const PopularSkills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const categories = [
    {
      title: "Tech & Code",
      icon: <Code size={30} />,
      skills: ["Web Development", "Python", "React", "AI Basics", "Freelancing"],
      color: "from-primary-600/20 to-primary-400/10",
    },
    {
      title: "Creative & Media",
      icon: <Brush size={30} />,
      skills: ["Photoshop", "TikTok Editing", "Canva", "Writing", "Video Production"],
      color: "from-secondary-600/20 to-secondary-400/10",
    },
    {
      title: "Real-Life Wins",
      icon: <BookOpen size={30} />,
      skills: ["Time Management", "Cooking", "Resume Building", "Public Speaking", "Home DIY"],
      color: "from-accent-600/20 to-accent-400/10",
    },
    {
      title: "Quick Money Skills",
      icon: <Briefcase size={30} />,
      skills: ["ChatGPT for Beginners", "Fiverr Setup", "Crypto Basics", "Etsy Store", "Side Hustle Ideas"],
      color: "from-accent-600/20 to-accent-400/10",
    },
    {
      title: "Teach These Skills",
      icon: <Sparkles size={30} />,
      skills: ["Excel for Beginners", "Creating Viral Reels", "Booking Clients on Upwork", "Personal Branding"],
      color: "from-primary-600/20 to-primary-400/10",
    },
    {
      title: "Most In-Demand",
      icon: <Clock size={30} />,
      skills: ["Digital Marketing", "SEO", "Data Analysis", "UI/UX Design", "Content Creation"],
      color: "from-secondary-600/20 to-secondary-400/10",
    },
  ];

  return (
    <section ref={ref} id="popular-skills" className="section bg-dark-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-gradient-radial from-primary-900/5 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-radial from-accent-900/5 to-transparent opacity-20"></div>
        
        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-900/10 rounded-full blur-[80px]"
        />
        
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          className="absolute bottom-1/3 left-1/5 w-48 h-48 bg-accent-900/10 rounded-full blur-[60px]"
        />
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-lg text-center mb-3"
          >
            Most Popular on SkillPod
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-16"
          >
            Discover the most in-demand skills people are learning and teaching on SkillPod
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => (
            <SkillCategory
              key={category.title}
              title={category.title}
              icon={category.icon}
              skills={category.skills}
              color={category.color}
              index={index}
            />
          ))}
        </div>

        {/* Featured Skills Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="premium-card p-8 md:p-10 mt-8"
        >
          <div className="relative">
            {/* Gradient glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-secondary-600/10 to-accent-500/20 rounded-xl blur-lg opacity-50"></div>
            
            <div className="relative z-10">
              <h3 className="heading-md text-center mb-10 text-white">Featured Skills With Real Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeaturedSkill 
                  title="Mobile Photography" 
                  students={642}
                  imagePath="/assets/skill.jpg" 
                />
                <FeaturedSkill 
                  title="Public Speaking" 
                  students={425}
                  imagePath="/assets/public_speaking.png" 
                />
                <FeaturedSkill 
                  title="Digital Marketing" 
                  students={1024}
                  imagePath="/assets/digital_marketing.jpeg" 
                />
                <FeaturedSkill 
                  title="Cooking" 
                  students={938}
                  imagePath="/assets/cooking.jpg" 
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface FeaturedSkillProps {
  title: string;
  students: number;
  imagePath: string;
}

const FeaturedSkill: React.FC<FeaturedSkillProps> = ({ title, students, imagePath }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
      onClick={() => {
        const waitlistSection = document.getElementById('waitlist');
        if (waitlistSection) {
          waitlistSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent z-10"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary-500/10 z-10 transition-opacity duration-300"></div>
        
        {/* Use actual images from assets folder */}
        <Image 
          src={imagePath} 
          alt={title}
          fill
          className="object-cover"
        />
        
        <div className="absolute bottom-3 left-3 z-20">
          <p className="text-white font-medium">{title}</p>
          <p className="text-sm text-gray-300">{students.toLocaleString()} students</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PopularSkills; 