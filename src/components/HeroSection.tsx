import React from 'react';
import Threads from './Threads';

interface HeroSectionProps {
  amplitude?: number;
  distance?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  amplitude = 5, 
  distance = 0.5 
}) => {
  return (
    <section className="relative w-full h-full overflow-hidden">
      {/* Background Threads - Now takes full section */}
      <div className="absolute inset-0 w-full h-full">
        <Threads amplitude={amplitude} distance={distance} />
      </div>
      
      {/* Hero Content - positioned above threads with its own padding, moved up by 1cm */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-6 md:px-12" style={{ marginTop: '-1cm' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">Ready to Begin</span>
            <br />
            <span className="text-white">Your Journey with</span>
            <br />
            <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
              FLUX
            </span>
            <span className="text-[#1DB954]">?</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Step into a world of <span className="text-[#1DB954] font-semibold">innovation</span> and 
            <span className="text-[#1DB954] font-semibold"> discovery</span>. Where curious minds 
            converge to shape the future through cutting-edge research and groundbreaking solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
