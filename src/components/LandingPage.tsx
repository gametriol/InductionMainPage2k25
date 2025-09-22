import React from 'react';
import { Zap } from 'lucide-react';
import HeroSection from './HeroSection';
import WhatWeDo from './WhatWeDo';

interface LandingPageProps {
  onJoinClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoinClick }) => {
  return (
    <div className="min-h-screen">
      {/* Space for Navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Hero Section - Full page minus navbar space */}
      <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
        <HeroSection />
      </div>

      {/* Main Content - Added top spacing to prevent overlap */}
      <main className="mt-20 pt-12">
        {/* What We Do Section */}
        <WhatWeDo />

        {/* Enhanced CTA Section - Moved much further down */}
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center mb-16 mt-24 md:mt-32 lg:mt-40">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Ready to Join the Innovation?
            </h3>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Become part of a community that values curiosity, creativity, and collaboration. 
              Join Flux and start your journey towards making a meaningful impact.
            </p>
            
            {/* Regular Button without Electric Border */}
            <div className="flex justify-center">
              <button
                onClick={onJoinClick}
                className="bg-gradient-to-r from-[#1DB954] via-[#00D4AA] to-[#1ed760] hover:from-[#FF6B35] hover:via-[#FF8C42] hover:to-[#FF6B35] text-black hover:text-white font-bold py-6 px-16 rounded-full text-xl transition-all duration-700 hover:shadow-2xl hover:shadow-[#FF6B35]/50 relative overflow-hidden border-2 border-[#1DB954]/30 hover:border-[#FF6B35]/50 group hover:scale-110 transform duration-500 ease-out"
              >
                {/* Animated lightning effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B35]/20 to-transparent opacity-0 group-hover:opacity-100 -skew-x-12 group-hover:animate-pulse rounded-full transition-all duration-700" />
                
                {/* Intense glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/40 via-[#FF8C42]/30 to-[#FF6B35]/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
                
                {/* Button text with enhanced effects */}
                <span className="relative z-10 flex items-center space-x-3">
                  <span className="drop-shadow-2xl font-black tracking-wide">JOIN FLUX NOW</span>
                  <Zap size={24} className="group-hover:rotate-45 group-hover:scale-125 transition-transform duration-700 drop-shadow-2xl" />
                </span>
              </button>
            </div>

            {/* Enhanced CTA info with dramatic styling */}
            <div className="mt-10 text-sm">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-[#FF6B35] rounded-full animate-pulse shadow-lg shadow-[#FF6B35]/50" />
               
                <div className="w-3 h-3 bg-[#FF6B35] rounded-full animate-pulse shadow-lg shadow-[#FF6B35]/50" />
              </div>
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#1DB954] rounded-full" />
                
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#1DB954] rounded-full" />
                  
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#1DB954] rounded-full" />
                 
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-gray-800">
        <div className="text-center text-gray-500">
          <p>&copy; 2025 Flux Society. Innovating the future, one project at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
