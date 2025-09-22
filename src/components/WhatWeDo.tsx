import React, { useEffect, useRef, useState } from 'react';
import { Users, Sparkles, Target, Zap } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';

// Activities data defined directly in the component
const activitiesData = [
  {
    title: "Research Projects",
    description: "Collaborative research initiatives in emerging technologies and scientific domains"
  },
  {
    title: "Workshops",
    description: "Hands-on learning sessions covering latest tools, frameworks, and methodologies"
  },
  {
    title: "Hackathons",
    description: "Intensive coding competitions to solve real-world problems and build innovative solutions"
  },
  {
    title: "Tech Discussions",
    description: "Regular meetups to discuss trends, share knowledge, and network with peers"
  }
];

const WhatWeDo: React.FC = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerRef.current && entry.isIntersecting) {
            setHeaderVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (headerRef.current) observer.observe(headerRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div ref={sectionRef} className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto mb-8 md:mb-16 -mt-8 md:-mt-12">
      {/* Responsive Layout - Minimal spacing between content and cards */}
      <div className={`relative flex flex-col lg:flex-row items-start lg:items-center ${
        isMobile ? 'gap-0 min-h-[500px]' : 'gap-16 min-h-[600px]'
      }`}>
        
        {/* Header Content - Mobile: Top, Desktop: Left */}
        <div 
          ref={headerRef}
          className={`w-full lg:flex-1 lg:max-w-lg transform transition-all duration-1000 ease-out ${
            headerVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          } ${isMobile ? 'text-center' : 'text-left'}`}
        >
          {/* Main Title with Icon - Reduced mobile margins */}
          <div className={`flex items-center mb-2 md:mb-4 lg:mb-6 ${isMobile ? 'justify-center' : ''}`}>
            <div className="relative">
              <Users className="text-[#1DB954] mr-2 md:mr-3" size={isMobile ? 24 : 32} />
              <Sparkles className="absolute -top-1 -right-1 text-[#1ed760] animate-pulse" size={10} />
            </div>
            <h2 className={`font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent ${
              isMobile ? 'text-2xl sm:text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'
            }`}>
              What We Do
            </h2>
          </div>

          {/* Subtitle - Minimal mobile spacing */}
          <div className={`${isMobile ? 'mb-2' : 'mb-4 md:mb-6 lg:mb-8'}`}>
            <p className={`text-gray-300 leading-relaxed mb-3 md:mb-4 lg:mb-6 ${
              isMobile ? 'text-sm sm:text-base px-1' : 'text-lg md:text-xl lg:text-2xl'
            }`}>
              Discover the diverse range of activities and initiatives that drive innovation 
              and foster collaborative learning within our community.
            </p>
            
            {/* Feature highlights - Compact mobile layout */}
            <div className={`mb-2 md:mb-6 lg:mb-8 ${
              isMobile ? 'flex flex-wrap justify-center gap-2 text-xs sm:text-sm' : 'space-y-4'
            }`}>
              <div className="flex items-center space-x-1 md:space-x-3 text-[#1DB954]">
                <Target size={isMobile ? 14 : 20} />
                <span className="font-semibold">Innovation Focused</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-3 text-[#1DB954]">
                <Users size={isMobile ? 14 : 20} />
                <span className="font-semibold">Community Driven</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-3 text-[#1DB954]">
                <Zap size={isMobile ? 14 : 20} />
                <span className="font-semibold">Cutting Edge</span>
              </div>
            </div>

            {/* Decorative line - Smaller on mobile */}
            <div className={`flex ${isMobile ? 'justify-center' : 'justify-start'}`}>
              <div className={`h-0.5 md:h-1 bg-gradient-to-r from-[#1DB954] via-[#1ed760] to-transparent rounded-full ${
                isMobile ? 'w-16' : 'w-20 md:w-24 lg:w-32'
              }`}></div>
            </div>
          </div>
        </div>

        {/* CardSwap - Larger cards on mobile */}
        <div className={`w-full lg:flex-1 relative ${
          isMobile ? '-mt-4 flex justify-center' : ''
        }`} style={{ 
          height: isMobile ? '420px' : '600px', 
          minHeight: isMobile ? '420px' : '600px' 
        }}>
          <div className={isMobile ? 'scale-[0.85] sm:scale-[0.9] -mt-8' : ''}>
            <CardSwap
              width={isMobile ? 320 : 400}
              height={isMobile ? 400 : 500}
              cardDistance={isMobile ? 45 : 60}
              verticalDistance={isMobile ? 55 : 70}
              delay={4000}
              pauseOnHover={true}
              easing="elastic"
            >
              {activitiesData.map((activity, index) => (
                <Card key={index} customClass="shadow-2xl">
                  <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-black h-full flex flex-col justify-between rounded-xl border border-gray-700/50 relative overflow-hidden ${
                    isMobile ? 'p-4 sm:p-5' : 'p-6 lg:p-8'
                  }`}>
                    
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/10 via-transparent to-[#1DB954]/5 rounded-xl" />
                    
                    {/* Card number badge */}
                    <div className="flex items-center mb-3 md:mb-4 relative z-10">
                      <div className={`bg-[#1DB954] rounded-full flex items-center justify-center text-black font-bold shadow-lg shadow-[#1DB954]/30 ${
                        isMobile ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-sm'
                      }`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="flex-grow relative z-10">
                      <h3 className={`font-bold mb-3 md:mb-4 leading-tight text-[#1DB954] ${
                        isMobile ? 'text-lg sm:text-xl' : 'text-xl lg:text-2xl xl:text-3xl'
                      }`}>
                        {activity.title}
                      </h3>
                      
                      <p className={`text-gray-300 leading-relaxed ${
                        isMobile ? 'text-sm line-clamp-4' : 'text-sm lg:text-base'
                      }`}>
                        {isMobile ? activity.description.substring(0, 120) + '...' : activity.description}
                      </p>
                    </div>

                    {/* Card footer */}
                    <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 relative z-10">
                      <div className={`rounded-full bg-gradient-to-r from-[#1DB954] to-transparent opacity-80 ${
                        isMobile ? 'h-0.5' : 'h-1'
                      }`} />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className={`absolute top-3 lg:top-4 right-3 lg:right-4 bg-[#1DB954]/30 rounded-full animate-pulse ${
                      isMobile ? 'w-2 h-2' : 'w-3 h-3'
                    }`} />
                    <div className={`absolute bottom-4 lg:bottom-6 right-4 lg:right-6 bg-[#1ed760]/40 rounded-full ${
                      isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'
                    }`} />
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
