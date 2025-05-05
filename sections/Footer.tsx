"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.1 * i,
        duration: 0.5,
      }
    })
  };
  
  return (
    <footer ref={ref} className="bg-dark-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-1/3 h-1/3 bg-primary-900/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-secondary-900/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <motion.div
            custom={0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
              SkillPod
            </h3>
            <p className="text-gray-400 mb-6">
              A fun, flexible, and rewarding learning platform where anyone can learn real-world skills, teach what they know, and earn money.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="https://twitter.com/Skill_Pod" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
              <SocialIcon icon={<Github size={18} />} href="#" />
            </div>
          </motion.div>
          
          <motion.div
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h4 className="text-lg font-medium mb-4 text-white">Connect With Us</h4>
            <ul className="space-y-3">
              <FooterLink href="https://twitter.com/Skill_Pod">
                <div className="flex items-center">
                  <Twitter size={16} className="mr-2 text-[#1DA1F2]" />
                  <span>Follow us on Twitter</span>
                </div>
              </FooterLink>
              <FooterLink href="https://t.me/skill_pod">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#0088cc]" width="16" height="16">
                    <path d="M21.5 4.5l-19 9.5L9 17l3.5 3.5L21.5 4.5z"></path>
                    <path d="M14.5 14.5L9 17"></path>
                  </svg>
                  <span>Join our Telegram</span>
                </div>
              </FooterLink>
              <FooterLink href="#">How it Works</FooterLink>
            </ul>
          </motion.div>
          
          <motion.div
            custom={2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h4 className="text-lg font-medium mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </motion.div>
          
          <motion.div
            custom={3}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h4 className="text-lg font-medium mb-4 text-white">Community</h4>
            <ul className="space-y-3">
              <FooterLink href="#waitlist">Join Waitlist</FooterLink>
              <FooterLink href="#waitlist">Telegram Community</FooterLink>
              <FooterLink href="#waitlist">Become a Teacher</FooterLink>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-dark-700 pt-8"
        >
          <p className="text-gray-500 text-center">
            &copy; {currentYear} SkillPod. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href?: string }) => (
  <a 
    href={href || "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500 transition-all duration-300 hover:scale-110"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
    >
      {children}
    </a>
  </li>
);

export default Footer; 