import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SkillSelectorProps {
  label: string;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  error?: string;
  suggestions: string[];
}

const SkillSelector: React.FC<SkillSelectorProps> = ({
  label,
  selectedSkills,
  onSkillsChange,
  error,
  suggestions
}) => {
  const [customSkill, setCustomSkill] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSkill = (skill: string) => {
    if (skill.trim() && !selectedSkills.includes(skill.trim())) {
      onSkillsChange([...selectedSkills, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleCustomSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim()) {
      addSkill(customSkill);
      setCustomSkill('');
    }
  };

  const filteredSuggestions = suggestions.filter(
    suggestion => !selectedSkills.includes(suggestion) && 
    suggestion.toLowerCase().includes(customSkill.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      
      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="bg-[#1DB954] text-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="hover:bg-black hover:bg-opacity-20 rounded-full p-1"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {/* Add Custom Skill */}
      <div className="relative">
        <form onSubmit={handleCustomSkillSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#1DB954] focus:outline-none transition-colors duration-300"
              placeholder="Add a skill..."
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && customSkill && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      addSkill(suggestion);
                      setCustomSkill('');
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>

      {/* Quick Add Suggestions */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 6).filter(suggestion => !selectedSkills.includes(suggestion)).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addSkill(suggestion)}
              className="bg-gray-800 hover:bg-[#1DB954] hover:text-black text-gray-300 px-3 py-1 rounded-full text-sm transition-all duration-300 border border-gray-600 hover:border-[#1DB954]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default SkillSelector;