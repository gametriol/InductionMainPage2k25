import React from 'react';
import { Zap, Users, Lightbulb, Rocket } from 'lucide-react';

interface LandingPageProps {
  onJoinClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoinClick }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 py-8 md:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1DB954] to-[#1ed760] rounded-full flex items-center justify-center">
            <Zap size={24} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Flux</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Welcome to Flux
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              A community of curious minds driven by research and innovation. 
              We focus on pushing boundaries, experimenting with new ideas, 
              and building solutions that create impact.
            </p>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#1DB954] transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <Lightbulb className="text-[#1DB954] mr-3" size={24} />
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To foster a culture of innovation where students can explore cutting-edge technologies, 
              collaborate on groundbreaking research, and develop solutions that shape the future.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#1DB954] transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <Rocket className="text-[#1DB954] mr-3" size={24} />
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To provide a platform for students to engage in research, participate in workshops, 
              collaborate on innovative projects, and contribute to technological advancement.
            </p>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 mb-16 border border-gray-700">
          <div className="flex items-center mb-8">
            <Users className="text-[#1DB954] mr-3" size={28} />
            <h3 className="text-3xl font-bold">What We Do</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
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
            ].map((activity, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-600 hover:border-[#1DB954] transition-all duration-300">
                <h4 className="font-semibold text-lg mb-3 text-[#1DB954]">{activity.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold mb-6">Ready to Join the Innovation?</h3>
            <p className="text-gray-300 text-lg mb-8">
              Become part of a community that values curiosity, creativity, and collaboration. 
              Join Flux and start your journey towards making a meaningful impact.
            </p>
            <button
              onClick={onJoinClick}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#1DB954]/25"
            >
              Join Flux Now
            </button>
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