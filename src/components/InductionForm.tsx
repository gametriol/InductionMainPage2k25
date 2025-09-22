import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, Check } from 'lucide-react';
import SkillSelector from './SkillSelector';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LightRays from './LightRays';

interface FormData {
  name: string;
  rollNo: string;
  branch: string;
  year: string;
  phone: string;
  email: string;
  society: string;
  whyJoin: string;
  softSkills: string;
  hardSkills: string;
  strengths: string;
  weaknesses: string;
  githubProfile: string;
  residence: string;
  imageFile: File | null;
}

const InductionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    rollNo: '',
    branch: '',
    year: '',
    phone: '',
    email: '',
    society: 'Flux',
    whyJoin: '',
    softSkills: '',
    hardSkills: '',
    strengths: '',
    weaknesses: '',
    githubProfile: '',
    residence: '',
    imageFile: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const countWords = (text: string): number => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };
   const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Firebase client app (safe to call on client only)
  useEffect(() => {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      // Basic guard - only initialize if apiKey exists
      if (firebaseConfig.apiKey) {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        onAuthStateChanged(auth, (u) => setUser(u));
      }
    } catch (err) {
      // ignore if firebase not configured in env
      console.warn('Firebase not configured or failed to initialize', err);
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      const firebaseConfigExists = import.meta.env.VITE_FIREBASE_API_KEY;
      if (!firebaseConfigExists) throw new Error('Firebase config missing. Set VITE_FIREBASE_API_KEY etc. in .env');

      const app = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      });

      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      // set email into formData and clear email errors
      handleInputChange('email', result.user.email || '');
      setErrors(prev => ({ ...prev, email: '' }));
    } catch (err: any) {
      console.error('Sign-in error', err);
      toast.error(`Sign-in failed: ${err?.message || err}`);
    }
  };

  const validateField = (name: keyof FormData, value: any): string => {
    switch (name) {
      case 'name':
        if (!value || value.length < 1 || value.length > 200) {
          return 'Name must be between 1 and 200 characters';
        }
        break;
      case 'rollNo':
        if (!value || value.length !== 10) {
          return 'Roll number must be exactly 10 characters';
        }
        break;
      case 'branch':
        if (!value || value.length < 1 || value.length > 200) {
          return 'Branch must be between 1 and 200 characters';
        }
        break;
      case 'year':
        if (!value || value.length < 1 || value.length > 20) {
          return 'Year must be between 1 and 20 characters';
        }
        break;
      case 'phone':
        const phoneRegex = /^[0-9+\-() ]{6,20}$/;
        if (!value || !phoneRegex.test(value)) {
          return 'Phone number must be 6-20 characters with numbers, +, -, (), or spaces';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'whyJoin':
        const whyJoinWords = countWords(value);
        if (!value || value.trim().length === 0) {
          return 'This field is required';
        }
        if (whyJoinWords > 200) {
          return 'Response must not exceed 200 words';
        }
        break;
      case 'softSkills':
      case 'hardSkills':
      case 'strengths':
      case 'weaknesses':
        const words = countWords(value);
        if (!value || value.trim().length === 0) {
          return 'This field is required';
        }
        if (words > 100) {
          return 'Response must not exceed 100 words';
        }
        break;
      case 'residence':
        if (!value || value.length < 1 || value.length > 200) {
          return 'Residence must be between 1 and 200 characters';
        }
        break;
      case 'imageFile':
        if (value) {
          if (!(value instanceof File)) {
            return 'Please select a valid image file';
          }
          
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
          if (!allowedTypes.includes(value.type)) {
            return 'Please select a .jpg, .jpeg, or .png file';
          }
          
          const maxSize = 1024 * 1024; // 1MB
          if (value.size > maxSize) {
            return 'Image size must be less than 1MB';
          }
        }
        break;
    }
    return '';
  };

  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: '' }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, imageFile: file }));
    
    // Clear error when user selects a file
    if (errors['imageFile']) {
      setErrors(prev => ({ ...prev, imageFile: '' }));
    }
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key as string] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // First: upload image to Cloudinary (if provided) and get secure URL
      let uploadedImageUrl = '';

      try {
        if (formData.imageFile) {
          const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL || '';
          if (!cloudinaryUrl) throw new Error('Cloudinary upload URL not configured. Set VITE_CLOUDINARY_UPLOAD_URL in your .env');

          const imgForm = new FormData();
          imgForm.append('file', formData.imageFile);
          // If using unsigned uploads, client may need an "upload_preset".
          // You can provide it via env as VITE_CLOUDINARY_UPLOAD_PRESET if required.
          const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
          if (preset) imgForm.append('upload_preset', preset);

          const uploadRes = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: imgForm
          });

          if (!uploadRes.ok) {
            const text = await uploadRes.text();
            throw new Error(`Image upload failed: ${uploadRes.status} ${text}`);
          }

          const uploadJson = await uploadRes.json();
          uploadedImageUrl = uploadJson.secure_url || uploadJson.url || '';
          if (!uploadedImageUrl) throw new Error('No secure_url returned from Cloudinary');
        }

        // Build payload for API
        const payload: Record<string, any> = {
          name: formData.name,
          rollNo: formData.rollNo,
          branch: formData.branch,
          year: formData.year,
          phone: formData.phone,
          email: formData.email,
          society: formData.society,
          whyJoin: formData.whyJoin,
          softSkills: formData.softSkills,
          hardSkills: formData.hardSkills,
          strengths: formData.strengths,
          weaknesses: formData.weaknesses,
          githubProfile: formData.githubProfile,
          residence: formData.residence,
          imageUrl: uploadedImageUrl || undefined
        };

        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
        const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server responded with ${res.status}: ${text}`);
        }

        // Success
        setIsSubmitted(true);
      } catch (err: any) {
        console.error('Submission error:', err);
        toast.error(`Submission failed: ${err?.message || err}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-black relative overflow-hidden">
        {/* LightRays Background for Success Page */}
        <div className="absolute inset-0 z-0">
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#00ffff"
              raysSpeed={1.5}
              lightSpread={2.2}
              rayLength={3.5}
              followMouse={true}
              mouseInfluence={0.4}
              noiseAmount={1.5}
              distortion={0.15}
              className="custom-rays"
            />
          </div>
        </div>

        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-black" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-gray-300 mb-8">
            Thank you for your interest in joining Flux. We'll review your application and get back to you soon.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold py-3 px-6 rounded-full transition-colors duration-300"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ToastContainer />
      
      {/* LightRays Background */}
      <div className="absolute inset-0 z-0">
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.5}
            lightSpread={2.8}
            rayLength={2.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
      </div>

      {/* Main Content - Moved Down */}
      <div className="relative z-10 py-12 px-6 pt-32 md:pt-40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-[#1DB954]">Flux</span> Induction Form
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">Join our community of innovators and researchers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sign-in / auth area */}
            {/* Simple Sign-in area without container box */}
{!user ? (
  <div className="text-center py-8">
    {/* Title */}
    <h3 className="text-2xl font-semibold text-white mb-2">Authentication Required</h3>
    <p className="text-gray-300 mb-8">Please sign in with Google to continue with your application.</p>

    {/* Enhanced Google Sign-in Button */}
    <div className="relative inline-block">
      {/* Button glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-full blur opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      <button
        type="button"
        onClick={signInWithGoogle}
        className="relative inline-flex items-center bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        {/* Button background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
        
        {/* Google Icon */}
        <svg className="w-6 h-6 mr-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.6-36.2-4.7-53.3H272v100.8h147.4c-6.4 34.7-25.7 64.1-54.7 83.6v69.4h88.3c51.6-47.6 81.5-117.7 81.5-200.5z"/>
          <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.2l-88.3-69.4c-24.6 16.5-56.2 26.2-92.5 26.2-71 0-131.3-47.9-152.9-112.2H27.3v70.5C72.4 487.9 165 544.3 272 544.3z"/>
          <path fill="#FBBC05" d="M119.1 323.2c-10.8-32.1-10.8-66.6 0-98.7V154h-91.8C7.8 199.5 0 234.7 0 272s7.8 72.5 27.3 118.1l91.8-66.9z"/>
          <path fill="#EA4335" d="M272 107.6c39.8 0 75.5 13.7 103.7 40.6l77.8-77.8C402.8 24.5 340.9 0 272 0 165 0 72.4 56.4 27.3 154l91.8 70.6C140.7 155.5 201 107.6 272 107.6z"/>
        </svg>
        
        {/* Button text */}
        <span className="relative font-bold text-lg">Sign in with Google</span>
      </button>
    </div>

    {/* Security note */}
    <div className="mt-6 flex items-center justify-center text-sm text-gray-400">
      <svg className="w-4 h-4 mr-2 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span>Secure authentication via Google OAuth</span>
    </div>
  </div>
) : (
  <div className="text-center py-8">
    {/* Success message */}
    <div className="flex items-center justify-center mb-6">
      <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mr-4">
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-left">
        <p className="text-[#1DB954] font-semibold text-lg">Successfully signed in!</p>
        <p className="text-gray-300">Welcome, {user.displayName || 'User'}</p>
      </div>
    </div>
    
    {/* User email info */}
    <p className="text-sm text-gray-400">
      Using email: <span className="text-white font-medium">{user.email}</span>
    </p>
  </div>
)}


            {/* Only show the rest of the form after user signs in */}
            {user ? (
              <>
              {/* Personal Information */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-[#1DB954]">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={formData.rollNo}
                      onChange={(e) => handleInputChange('rollNo', e.target.value)}
                      disabled={!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                      placeholder="10-digit roll number"
                      maxLength={10}
                    />
                    {errors.rollNo && <p className="text-red-400 text-sm mt-1">{errors.rollNo}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Branch *
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                      disabled={!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                    >
                      <option value="">Select branch</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="IOT">IOT</option>
                      <option value="EE">EE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                      <option value="CHE">CHE</option>
                      <option value="BPharma">BPharma</option>
                    </select>
                    {errors.branch && <p className="text-red-400 text-sm mt-1">{errors.branch}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year *
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      disabled={!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                    {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-[#1DB954]">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!user}
                      readOnly={!!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Residence *
                    </label>
                    <input
                      type="text"
                      value={formData.residence}
                      onChange={(e) => handleInputChange('residence', e.target.value)}
                      disabled={!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                      placeholder="City, State"
                    />
                    {errors.residence && <p className="text-red-400 text-sm mt-1">{errors.residence}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub Profile (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.githubProfile}
                      onChange={(e) => handleInputChange('githubProfile', e.target.value)}
                      disabled={!user}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
              </div>

              {/* Society Information */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-[#1DB954]">Society Information</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Society *
                  </label>
                  <input
                    type="text"
                    value={formData.society}
                    onChange={(e) => handleInputChange('society', e.target.value)}
                    disabled={!user}
                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                    placeholder="Enter your society (e.g., Flux or another)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Why do you want to join Flux? *
                  </label>
                  <textarea
                    value={formData.whyJoin}
                    onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                    disabled={!user}
                    rows={5}
                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
                    placeholder="Share your motivation, interests, and what you hope to contribute to Flux..."
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>{errors.whyJoin && <span className="text-red-400">{errors.whyJoin}</span>}</span>
                    <span className={countWords(formData.whyJoin) > 200 ? 'text-red-400' : ''}>
                      {countWords(formData.whyJoin)}/200 words
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills & Attributes */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-[#1DB954]">Skills & Attributes</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Soft Skills *
                    </label>
                    <textarea
                      value={formData.softSkills}
                      onChange={(e) => handleInputChange('softSkills', e.target.value)}
                      disabled={!user}
                      rows={4}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
                      placeholder="Describe your soft skills such as leadership, communication, teamwork, problem solving, creativity, adaptability, time management, critical thinking, etc."
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{errors.softSkills && <span className="text-red-400">{errors.softSkills}</span>}</span>
                      <span className={countWords(formData.softSkills) > 100 ? 'text-red-400' : ''}>
                        {countWords(formData.softSkills)}/100 words
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hard Skills *
                    </label>
                    <textarea
                      value={formData.hardSkills}
                      onChange={(e) => handleInputChange('hardSkills', e.target.value)}
                      disabled={!user}
                      rows={4}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
                      placeholder="Describe your technical skills such as programming languages, frameworks, tools, technologies, etc."
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{errors.hardSkills && <span className="text-red-400">{errors.hardSkills}</span>}</span>
                      <span className={countWords(formData.hardSkills) > 100 ? 'text-red-400' : ''}>
                        {countWords(formData.hardSkills)}/100 words
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Strengths *
                    </label>
                    <textarea
                      value={formData.strengths}
                      onChange={(e) => handleInputChange('strengths', e.target.value)}
                      disabled={!user}
                      rows={4}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
                      placeholder="Describe your key strengths and what makes you stand out."
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{errors.strengths && <span className="text-red-400">{errors.strengths}</span>}</span>
                      <span className={countWords(formData.strengths) > 100 ? 'text-red-400' : ''}>
                        {countWords(formData.strengths)}/100 words
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Areas for Improvement *
                    </label>
                    <textarea
                      value={formData.weaknesses}
                      onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                      disabled={!user}
                      rows={4}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
                      placeholder="Describe areas where you'd like to improve and grow."
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{errors.weaknesses && <span className="text-red-400">{errors.weaknesses}</span>}</span>
                      <span className={countWords(formData.weaknesses) > 100 ? 'text-red-400' : ''}>
                        {countWords(formData.weaknesses)}/100 words
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-[#1DB954]">Profile Picture (Optional)</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Image
                  </label>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileChange(file);
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={!user}
                    />
                    <label
                      htmlFor={user ? 'image-upload' : undefined}
                      className={`w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-3 text-white ${!user ? 'cursor-not-allowed opacity-60' : 'hover:border-[#1DB954] focus-within:border-[#1DB954]'} transition-colors duration-300 flex items-center justify-center min-h-[48px] group`}
                    >
                      <Upload size={20} className="mr-2 text-gray-400 group-hover:text-[#1DB954] transition-colors duration-300" />
                      <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                        {formData.imageFile ? formData.imageFile.name : 'Choose image file (.jpg, .jpeg, .png, max 1MB)'}
                      </span>
                    </label>
                  </div>
                  
                  {errors.imageFile && <p className="text-red-400 text-sm mt-1">{errors.imageFile}</p>}
                  
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Preview:</p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleFileChange(null);
                            const input = document.getElementById('image-upload') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={!user || isSubmitting}
                  className="bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-gray-600 text-black font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#1DB954]/25 disabled:transform-none disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Application...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
              </>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InductionForm;
