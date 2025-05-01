"use client";

import React from 'react';

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  error,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label} {required && <span className="text-primary-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 rounded-lg bg-dark-600 border ${
            error ? 'border-red-500' : 'border-dark-500'
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white ${className}`}
        />
        {/* Subtle gradient glow on focus */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-secondary-500/0 opacity-0 transition-opacity duration-300 pointer-events-none peer-focus:opacity-100"></div>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default Input; 