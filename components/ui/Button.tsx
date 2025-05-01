"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'rounded-lg font-medium inline-flex items-center justify-center relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white',
    secondary: 'bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-600/30 text-white',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={!disabled ? { 
        scale: 1.02,
        boxShadow: "0px 0px 8px rgba(24, 144, 255, 0.5)",
      } : {}}
      className={`premium-button ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {/* Glow effect */}
      <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
      
      {children}
    </motion.button>
  );
};

export default Button; 