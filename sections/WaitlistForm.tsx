"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CheckCircle, Loader2, SparklesIcon, Twitter, Send, Share2, ArrowRight, ChevronLeft, Search, X, Plus, Facebook, Linkedin, Copy } from 'lucide-react';
import { useWaitlist } from '@/utils/WaitlistContext';

// Step types
type FormStep = 1 | 2 | 3 | 4;

// Extended form data for multi-step form
interface FormData {
  name: string;
  email: string;
  learningSkills: string[];
  teachingSkills: string[];
  wantsToTeach: boolean;
  waitlistRank: number;
  points: number;
  sharedTwitter: boolean;
  joinedDiscord: boolean;
  invitedFriends: boolean;
}

const initialFormState: FormData = {
  name: '',
  email: '',
  learningSkills: [],
  teachingSkills: [],
  wantsToTeach: false,
  waitlistRank: Math.floor(Math.random() * 980) + 3020, // Between 3020-4000
  points: 0,
  sharedTwitter: false,
  joinedDiscord: false,
  invitedFriends: false,
};

// Sample skills for dropdown
const skillOptions = [
  "Web Development", "Python", "React", "Graphic Design", "Video Editing",
  "UI/UX Design", "Content Writing", "ChatGPT Prompting", "TikTok Creation",
  "Public Speaking", "Excel", "Data Analysis", "Photography", "Cooking",
  "Guitar", "Language Learning", "Fitness", "Meditation", "Budgeting",
  "Resume Writing", "Interview Skills", "Digital Marketing", "SEO"
];

const WaitlistForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [filteredSkills, setFilteredSkills] = useState(skillOptions);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [socialActionMessage, setSocialActionMessage] = useState('');
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [clipboardMessage, setClipboardMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
  });
  
  // Get waitlist context to increment count
  const { incrementWaitlistCount } = useWaitlist();
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  // Filter skills based on input
  useEffect(() => {
    if (skillInput.trim() === '') {
      setFilteredSkills(skillOptions);
    } else {
      setFilteredSkills(
        skillOptions.filter(skill => 
          skill.toLowerCase().includes(skillInput.toLowerCase())
        )
      );
    }
  }, [skillInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Just update the state without any side effects
      setFormData(prev => ({ ...prev, [id]: checked }));
      // Prevent propagation to avoid any parent forms from auto-submitting
      e.stopPropagation();
      e.preventDefault(); 
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
      
      // Validate email
      if (id === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
      }
      
      // Validate name
      if (id === 'name') {
        if (value && value.length < 2) {
          setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
        } else {
          setErrors(prev => ({ ...prev, name: '' }));
        }
      }
    }
  };

  const handleSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setShowSkillDropdown(true);
  };

  const addSkill = (skill: string, type: 'learning' | 'teaching') => {
    if (type === 'learning') {
      if (!formData.learningSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          learningSkills: [...prev.learningSkills, skill]
        }));
      }
    } else {
      if (!formData.teachingSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          teachingSkills: [...prev.teachingSkills, skill]
        }));
      }
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string, type: 'learning' | 'teaching') => {
    if (type === 'learning') {
      setFormData(prev => ({
        ...prev,
        learningSkills: prev.learningSkills.filter(s => s !== skill)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        teachingSkills: prev.teachingSkills.filter(s => s !== skill)
      }));
    }
  };

  const addCustomSkill = (type: 'learning' | 'teaching') => {
    if (skillInput.trim() !== '') {
      addSkill(skillInput.trim(), type);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setClipboardMessage('Link copied to clipboard!');
        setTimeout(() => setClipboardMessage(''), 3000);
      },
      (err) => {
        console.error('Failed to copy: ', err);
        setClipboardMessage('Failed to copy link');
        setTimeout(() => setClipboardMessage(''), 3000);
      }
    );
  };

  const handleSocialAction = (action: 'twitter' | 'discord' | 'invite') => {
    // Prevent default form submission behavior
    if (action === 'invite') {
      // Show social sharing options instead of immediately marking as complete
      setShowSocialOptions(true);
      return; // Exit early, points will be added after sharing
    }
    
    // In a real app, you'd integrate with social APIs
    // For now, we'll simulate the action
    let pointsToAdd = 0;
    
    if (action === 'twitter' && !formData.sharedTwitter) {
      pointsToAdd = 25;
      setFormData(prev => ({ ...prev, sharedTwitter: true }));
      
      // Copy link to clipboard
      const shareText = "I just joined the waitlist for @Skill_Pod - a platform to learn and teach skills while earning! Join me:";
      const shareUrl = window.location.origin;
      copyToClipboard(shareUrl);
      
      // Open Twitter with pre-populated post
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
      
      setSocialActionMessage('Link copied! Opening Twitter...');
    } else if (action === 'discord' && !formData.joinedDiscord) {
      pointsToAdd = 15;
      setFormData(prev => ({ ...prev, joinedDiscord: true }));
      
      // Open Telegram channel link
      const telegramUrl = 'https://t.me/skill_pod';
      window.open(telegramUrl, '_blank');
      
      setSocialActionMessage('Opening Telegram channel...');
    }
    
    if (pointsToAdd > 0) {
      const newPoints = formData.points + pointsToAdd;
      const newRank = Math.max(formData.waitlistRank - Math.floor(pointsToAdd / 5), 3020); // Set minimum rank to 3020
      
      setFormData(prev => ({
        ...prev,
        points: newPoints,
        waitlistRank: newRank
      }));
    }
  };

  // Function to handle sharing via different platforms
  const handleShare = (platform: string) => {
    // Create share message with flier image
    const shareUrl = window.location.origin;
    const shareText = "Join me on SkillPod - where you can learn and teach skills while earning!";
    const twitterText = "Join me on @Skill_Pod - where you can learn and teach skills while earning! Follow our journey.";
    const flierImageUrl = `${window.location.origin}/assets/flier.png`;
    
    // Copy the URL to clipboard first
    copyToClipboard(shareUrl);
    
    // Open appropriate share link based on platform
    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&picture=${encodeURIComponent(flierImageUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      case 'copy':
        // Already copied to clipboard above
        setSocialActionMessage('Link copied to clipboard!');
        break;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
    
    // Mark invite as complete and add points
    if (!formData.invitedFriends) {
      const pointsToAdd = 30;
      const newPoints = formData.points + pointsToAdd;
      const newRank = Math.max(formData.waitlistRank - Math.floor(pointsToAdd / 5), 3001);
      
      setFormData(prev => ({
        ...prev,
        invitedFriends: true,
        points: newPoints,
        waitlistRank: newRank
      }));
    }
    
    // Hide social options after sharing
    setShowSocialOptions(false);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => (prev + 1) as FormStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as FormStep);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / 3) * 100;

  // Render the appropriate step
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="step1"
            className="space-y-5"
          >
            <h3 className="text-xl text-white font-medium mb-4">Who Are You?</h3>
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
            <div className="flex items-center space-x-2 mt-4" onClick={(e) => {
              e.preventDefault(); 
              e.stopPropagation();
            }}>
              <input
                id="wantsToTeach"
                type="checkbox"
                checked={formData.wantsToTeach}
                onChange={(e) => {
                  // Prevent default behavior of form submission
                  e.preventDefault();
                  e.stopPropagation();
                  // Directly set form data instead of using handleChange to avoid any side effects
                  setFormData(prev => ({ ...prev, wantsToTeach: !prev.wantsToTeach }));
                }}
                className="w-4 h-4 accent-primary-500 bg-dark-700 border-dark-500 rounded focus:ring-primary-500 text-primary-500"
                onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
                style={{ 
                  colorScheme: 'dark',
                  accentColor: 'var(--primary-500, #7e42f5)'
                }}
              />
              <label 
                htmlFor="wantsToTeach" 
                className="text-gray-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFormData(prev => ({ ...prev, wantsToTeach: !prev.wantsToTeach }));
                }}
              >
                I want to both teach and learn
              </label>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="step2"
            className="space-y-5"
          >
            <h3 className="text-xl text-white font-medium mb-4">What Do You Want to Learn?</h3>
            <div className="relative">
              <div className="flex items-center relative">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={skillInput}
                  onChange={handleSkillInput}
                  placeholder="Search skills or add your own"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-600 border border-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 focus:text-white focus:bg-dark-600"
                  style={{
                    WebkitTextFillColor: 'currentcolor',
                    caretColor: 'white',
                  }}
                  onFocus={() => setShowSkillDropdown(true)}
                />
                <button
                  onClick={() => addCustomSkill('learning')}
                  className="absolute right-3 text-primary-400 hover:text-primary-300"
                  type="button"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {showSkillDropdown && (
                <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-dark-700 border border-dark-600 rounded-lg shadow-lg">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2 hover:bg-dark-600 cursor-pointer text-gray-300 hover:text-white transition-colors"
                        onClick={() => addSkill(skill, 'learning')}
                      >
                        {skill}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">
                      No skills found. Click + to add a custom skill.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Selected Skills</label>
              <div className="flex flex-wrap gap-2">
                {formData.learningSkills.length > 0 ? (
                  formData.learningSkills.map(skill => (
                    <div key={skill} className="bg-primary-900/30 text-primary-300 px-3 py-1 rounded-full text-sm flex items-center">
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill, 'learning')}
                        className="ml-2 text-primary-300 hover:text-primary-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Add at least one skill you want to learn
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return formData.wantsToTeach ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="step3"
            className="space-y-5"
          >
            <h3 className="text-xl text-white font-medium mb-4">What Can You Teach Others?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Even basic skills are valuable — you can get paid to teach them!
            </p>
            
            <div className="relative">
              <div className="flex items-center relative">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={skillInput}
                  onChange={handleSkillInput}
                  placeholder="Search skills or add your own"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-600 border border-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 focus:text-white focus:bg-dark-600"
                  style={{
                    WebkitTextFillColor: 'currentcolor',
                    caretColor: 'white',
                  }}
                  onFocus={() => setShowSkillDropdown(true)}
                />
                <button
                  onClick={() => addCustomSkill('teaching')}
                  className="absolute right-3 text-primary-400 hover:text-primary-300"
                  type="button"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {showSkillDropdown && (
                <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-dark-700 border border-dark-600 rounded-lg shadow-lg">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2 hover:bg-dark-600 cursor-pointer text-gray-300 hover:text-white transition-colors"
                        onClick={() => addSkill(skill, 'teaching')}
                      >
                        {skill}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">
                      No skills found. Click + to add a custom skill.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Selected Skills</label>
              <div className="flex flex-wrap gap-2">
                {formData.teachingSkills.length > 0 ? (
                  formData.teachingSkills.map(skill => (
                    <div key={skill} className="bg-accent-900/30 text-accent-300 px-3 py-1 rounded-full text-sm flex items-center">
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill, 'teaching')}
                        className="ml-2 text-accent-300 hover:text-accent-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Add at least one skill you can teach
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          // If they don't want to teach, skip to step 4
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0 }}
            key="skip-step3"
            className="space-y-5"
            onAnimationComplete={() => setCurrentStep(4)}
          >
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-primary-500" size={32} />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="step4"
            className="space-y-5"
          >
            <h3 className="text-xl text-white font-medium mb-4">Boost Your Waitlist Position</h3>
            
            {renderBoostSection()}
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Within the case 4 return statement, update the buttons:
  const renderBoostSection = () => (
    <div className="bg-dark-700/70 p-5 rounded-xl mb-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-300">Current Position</span>
        <span className="text-2xl font-bold text-primary-400">#{formData.waitlistRank}</span>
      </div>
      
      <div className="mb-4">
        <div className="h-2 bg-dark-600 rounded-full mb-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full"
            style={{ width: `${Math.min((formData.points / 100) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>0 pts</span>
          <span>Current: {formData.points} pts</span>
          <span>100 pts</span>
        </div>
      </div>
      
      {clipboardMessage && (
        <div className="bg-primary-900/30 text-primary-300 p-2 rounded mb-4 text-sm text-center">
          {clipboardMessage}
        </div>
      )}
      
      {socialActionMessage && (
        <div className="bg-primary-900/30 text-primary-300 p-2 rounded mb-4 text-sm text-center">
          {socialActionMessage}
        </div>
      )}
      
      <p className="text-gray-300 mb-4">Complete these actions to move up the waitlist:</p>
      
      <div className="space-y-3">
        <button
          onClick={() => handleSocialAction('twitter')}
          disabled={formData.sharedTwitter}
          className={`w-full flex items-center justify-between p-3 rounded-lg ${
            formData.sharedTwitter 
              ? 'bg-primary-900/20 text-primary-300' 
              : 'bg-dark-600 hover:bg-dark-500 text-white'
          } transition-colors`}
        >
          <div className="flex items-center">
            <Twitter className="mr-3" size={18} />
            <span>Share on Twitter</span>
          </div>
          <span className={formData.sharedTwitter ? 'text-primary-300' : 'text-primary-400'}>
            {formData.sharedTwitter ? 'Completed +25pts' : '+25 pts'}
          </span>
        </button>
        
        <button
          onClick={() => handleSocialAction('discord')}
          disabled={formData.joinedDiscord}
          className={`w-full flex items-center justify-between p-3 rounded-lg ${
            formData.joinedDiscord 
              ? 'bg-primary-900/20 text-primary-300' 
              : 'bg-dark-600 hover:bg-dark-500 text-white'
          } transition-colors`}
        >
          <div className="flex items-center">
            <Send className="mr-3" size={18} />
            <span>Join our Telegram Channel</span>
          </div>
          <span className={formData.joinedDiscord ? 'text-primary-300' : 'text-primary-400'}>
            {formData.joinedDiscord ? 'Completed +15pts' : '+15 pts'}
          </span>
        </button>
        
        <div>
          <button
            type="button"
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
              handleSocialAction('invite');
            }}
            disabled={formData.invitedFriends}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${
              formData.invitedFriends 
                ? 'bg-primary-900/20 text-primary-300' 
                : 'bg-dark-600 hover:bg-dark-500 text-white'
            } transition-colors`}
          >
            <div className="flex items-center">
              <Share2 className="mr-3" size={18} />
              <span>Invite friends</span>
            </div>
            <span className={formData.invitedFriends ? 'text-primary-300' : 'text-primary-400'}>
              {formData.invitedFriends ? 'Completed +30pts' : '+30 pts'}
            </span>
          </button>
          
          {/* Social sharing options */}
          {showSocialOptions && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-dark-600 rounded-lg"
            >
              <p className="text-sm text-gray-300 mb-3">Share via:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button 
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleShare('facebook');
                  }}
                  className="w-9 h-9 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <Facebook size={18} />
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleShare('twitter');
                  }}
                  className="w-9 h-9 rounded-full bg-[#1da1f2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <Twitter size={18} />
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleShare('linkedin');
                  }}
                  className="w-9 h-9 rounded-full bg-[#0077b5] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <Linkedin size={18} />
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleShare('telegram');
                  }}
                  className="w-9 h-9 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <Send size={18} />
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleShare('whatsapp');
                  }}
                  className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleShare('copy');
                  }}
                  className="w-9 h-9 rounded-full bg-dark-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <Copy size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Task completion indicator */}
      <div className="mt-4 p-3 rounded-lg bg-dark-600/50">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Tasks completed:</span>
          <span>{[formData.sharedTwitter, formData.joinedDiscord, formData.invitedFriends].filter(Boolean).length}/3</span>
        </div>
        <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(([formData.sharedTwitter, formData.joinedDiscord, formData.invitedFriends].filter(Boolean).length / 3) * 100)}%` }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          ></motion.div>
        </div>
      </div>
    </div>
  );

  const calculatePoints = () => {
    let points = 0;
    if (formData.sharedTwitter) points += 25;
    if (formData.joinedDiscord) points += 15;
    if (formData.invitedFriends) points += 30;
    return points;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.name || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // Validate skills
      if (formData.learningSkills.length === 0 && formData.teachingSkills.length === 0) {
        setError('Please add at least one skill you want to learn or teach');
        return;
      }
      
      // Generate waitlist rank
      const waitlistRank = Math.floor(Math.random() * (4000 - 3020 + 1)) + 3020;
      
      // Calculate points
      const points = calculatePoints();
      
      // Submit to API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          waitlistRank,
          points,
          socialActions: {
            sharedTwitter: false,
            joinedDiscord: false,
            invitedFriends: false
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }
      
      // Increment the global waitlist count
      incrementWaitlistCount();
      
      // Show success state
      setIsSuccess(true);
      
      // Reset form
      setFormData(initialFormState);
      setCurrentStep(1);
      setSkillInput('');
      setShowSkillDropdown(false);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="waitlist" className="section bg-dark-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl mx-auto premium-card overflow-hidden"
        >
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-accent-500/20 rounded-2xl blur-lg opacity-50"></div>
            
            <div className="relative p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
                    <SparklesIcon className="text-accent-400" size={24} />
                  </div>
                </div>
                <h2 className="heading-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400">
                  Join the SkillSwap Waitlist
                </h2>
                <p className="text-gray-400">
                  Be the first to experience a new way of learning and teaching skills that matter.
                </p>
              </motion.div>

              {/* Progress bar */}
              {!isSuccess && (
                <div className="mb-8">
                  <div className="h-1 w-full bg-dark-600 rounded-full mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    ></motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <div className={`${currentStep >= 1 ? 'text-primary-400' : ''}`}>Basic Info</div>
                    <div className={`${currentStep >= 2 ? 'text-primary-400' : ''}`}>Learning</div>
                    <div className={`${currentStep >= 3 ? 'text-primary-400' : ''}`}>Teaching</div>
                    <div className={`${currentStep >= 4 ? 'text-primary-400' : ''}`}>Boost</div>
                  </div>
                </div>
              )}

              {!isSuccess ? (
                <form 
                  onSubmit={handleSubmit}
                >
                  <AnimatePresence mode="wait">
                    {renderStep()}
                  </AnimatePresence>
                  
                  {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                  
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <Button 
                        onClick={(e) => {
                          e?.preventDefault();
                          e?.stopPropagation();
                          prevStep();
                        }}
                        variant="secondary"
                        type="button"
                      >
                        <ChevronLeft size={18} className="mr-1" /> Back
                      </Button>
                    )}
                    
                    <div className="ml-auto">
                      {currentStep < 4 ? (
                        <Button 
                          onClick={(e) => {
                            e?.preventDefault();
                            e?.stopPropagation();
                            nextStep();
                          }}
                          disabled={
                            (currentStep === 1 && (!formData.name || !formData.email || !!errors.name || !!errors.email)) || 
                            (currentStep === 2 && formData.learningSkills.length === 0) ||
                            (currentStep === 3 && formData.wantsToTeach && formData.teachingSkills.length === 0)
                          }
                          type="button"
                        >
                          Next <ArrowRight size={18} className="ml-1" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                            </span>
                          ) : (
                            'Submit & Join Waitlist'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10"
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
                  <h3 className="heading-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400">
                    You're on the waitlist!
                  </h3>
                  <p className="text-gray-300 max-w-md mx-auto mb-6">
                    Your waitlist position is <span className="text-primary-400 font-semibold">#{formData.waitlistRank}</span>. We've sent a confirmation email to <span className="text-primary-400">{formData.email}</span> with more details.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button 
                      variant="primary"
                      onClick={() => window.open('https://twitter.com/Skill_Pod', '_blank')}
                      type="button"
                    >
                      <Twitter size={18} className="mr-2" /> Follow on Twitter
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => window.open('https://t.me/skill_pod', '_blank')}
                      type="button"
                    >
                      <Send size={18} className="mr-2" /> Join Telegram
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistForm; 