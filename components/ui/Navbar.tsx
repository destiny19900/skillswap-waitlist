"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <a href="#" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
            SkillPod.
          </a>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#categories">Skills</NavLink>
          <NavLink href="#teaching">Teach</NavLink>
          <NavLink href="#about">About</NavLink>
          <Button size="sm">Join Waitlist</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark"
          >
            <div className="container py-4 flex flex-col space-y-4">
              <NavLink href="#features" mobile onClick={() => setIsMobileMenuOpen(false)}>Features</NavLink>
              <NavLink href="#categories" mobile onClick={() => setIsMobileMenuOpen(false)}>Skills</NavLink>
              <NavLink href="#teaching" mobile onClick={() => setIsMobileMenuOpen(false)}>Teach</NavLink>
              <NavLink href="#about" mobile onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
              <Button>Join Waitlist</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile = false, onClick }) => {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className={`${
        mobile ? 'block py-2' : ''
      } text-white/80 hover:text-white hover:text-glow transition-all duration-200`}
    >
      {children}
    </a>
  );
};

export default Navbar; 