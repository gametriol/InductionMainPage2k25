import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import LandingPage from './components/LandingPage';
import InductionForm from './components/InductionForm';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'form'>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage('form');
      setIsTransitioning(false);
    }, 300);
  };

  const navigateToLanding = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage('landing');
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {currentPage === 'form' && (
          <button
            onClick={navigateToLanding}
            className="fixed top-6 left-6 z-50 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        )}
        
        {currentPage === 'landing' ? (
          <LandingPage onJoinClick={navigateToForm} />
        ) : (
          <InductionForm />
        )}
      </div>
    </div>
  );
}

export default App;