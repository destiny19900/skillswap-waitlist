"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, X, Users, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Collaborators = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    skills: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    skills: '',
    message: ''
  });
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Validate fields
    switch (id) {
      case 'name':
        if (value && value.length < 2) {
          setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
        } else {
          setErrors(prev => ({ ...prev, name: '' }));
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
        break;
      case 'skills':
        if (value && value.length < 3) {
          setErrors(prev => ({ ...prev, skills: 'Please provide more detail about your skills' }));
        } else {
          setErrors(prev => ({ ...prev, skills: '' }));
        }
        break;
      case 'message':
        if (value && value.length < 10) {
          setErrors(prev => ({ ...prev, message: 'Message should be at least 10 characters' }));
        } else {
          setErrors(prev => ({ ...prev, message: '' }));
        }
        break;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const validationErrors = {
      name: !formData.name ? 'Name is required' : 
            formData.name.length < 2 ? 'Name must be at least 2 characters' : '',
      email: !formData.email ? 'Email is required' : 
             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Please enter a valid email address' : '',
      skills: !formData.skills ? 'Skills are required' : 
              formData.skills.length < 3 ? 'Please provide more detail about your skills' : '',
      message: !formData.message ? 'Message is required' : 
               formData.message.length < 10 ? 'Message should be at least 10 characters' : ''
    };
    
    // Check if any validation errors exist
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    
    if (hasErrors) {
      setErrors(validationErrors);
      return; // Stop form submission if there are errors
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Send email using SMTP
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          skills: formData.skills
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Show success state
      setIsSuccess(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: '',
          skills: ''
        });
        setIsSuccess(false);
        setShowForm(false);
      }, 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section ref={ref} id="collaborate" className="bg-dark-900 pt-16 pb-16 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-primary-900/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/3 w-1/2 h-1/2 bg-secondary-900/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 inline-block"
          >
            <span className="px-4 py-1 rounded-full glass text-white/80 text-sm font-medium">
              Be Part of Our Journey
            </span>
          </motion.div>
          
          <h2 className="heading-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400 mb-4">
            Join Our Collaborator Network
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            We're looking for passionate individuals and organizations to help shape the future of skill-sharing and learning. Connect with us to explore partnership opportunities.
          </p>
          
          {!showForm && !isSuccess && (
            <Button 
              size="lg"
              onClick={() => setShowForm(true)}
              variant="primary"
            >
              <Users size={18} className="mr-2" /> Become a Collaborator
            </Button>
          )}
        </motion.div>
        
        <AnimatePresence mode="wait">
          {showForm && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="premium-card overflow-hidden">
                <div className="relative">
                  {/* Background glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-accent-500/20 rounded-2xl blur-lg opacity-50"></div>
                  
                  <div className="relative p-8 md:p-10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl text-white font-medium">Connect With Us</h3>
                      <button 
                        onClick={() => setShowForm(false)} 
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        id="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        error={errors.name}
                      />
                      
                      <Input
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        required
                        error={errors.email}
                      />
                      
                      <Input
                        id="skills"
                        label="Your Skills/Expertise"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="What skills or expertise can you contribute?"
                        required
                        error={errors.skills}
                      />
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                          Message
                        </label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us how you'd like to collaborate with SkillPod..."
                          className="w-full px-4 py-3 rounded-lg bg-dark-600 border border-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white resize-none min-h-[120px] placeholder-gray-400 focus:text-white focus:bg-dark-600"
                          style={{
                            WebkitTextFillColor: 'currentcolor',
                            caretColor: 'white',
                          }}
                          required
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                      </div>
                      
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              Sending...
                            </span>
                          ) : (
                            <>
                              Send Message <ArrowRight size={18} className="ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 max-w-md mx-auto premium-card p-10"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 1, ease: "easeInOut", times: [0, 0.5, 1] }}
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-r from-primary-800 to-primary-600 flex items-center justify-center"
              >
                <CheckCircle className="text-white" size={40} />
              </motion.div>
              <h3 className="heading-md mb-2 text-primary-400">Message Sent!</h3>
              <p className="text-gray-400 mb-4">
                Thank you for reaching out! We'll get back to you soon to discuss collaboration opportunities.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Collaborators; 