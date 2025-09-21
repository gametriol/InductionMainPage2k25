import React, { useState } from 'react';
import { Upload, X, Plus, Check } from 'lucide-react';
import SkillSelector from './SkillSelector';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const countWords = (text: string): number => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
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
        // Show a simple alert. Could be improved to show inline error.
        alert(`Submission failed: ${err.message || err}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
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
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 pt-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#1DB954]">Flux</span> Induction Form
          </h1>
          <p className="text-gray-400">Join our community of innovators and researchers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
          </div>

          {/* Society Information */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-[#1DB954]">Society Information</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Society *
              </label>
              <input
                type="text"
                value={formData.society}
                onChange={(e) => handleInputChange('society', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
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
                rows={5}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
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
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-[#1DB954]">Skills & Attributes</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Soft Skills *
                </label>
                <textarea
                  value={formData.softSkills}
                  onChange={(e) => handleInputChange('softSkills', e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
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
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
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
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
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
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300 resize-vertical"
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
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
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
                />
                <label
                  htmlFor="image-upload"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white hover:border-[#1DB954] focus-within:border-[#1DB954] transition-colors duration-300 cursor-pointer flex items-center justify-center min-h-[48px] group"
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
              disabled={isSubmitting}
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
        </form>
      </div>
    </div>
  );
};

export default InductionForm;