"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useNavigation } from "../hooks/useNavigation";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  const { navigateWithCache } = useNavigation();
  const prompts = [
    { 
      text: "ជួយខ្ញុំរៀនគណិតវិទ្យា", 
      gradient: "from-emerald-400 to-cyan-400",
      category: "Education"
    },
    { 
      text: "បង្រៀនខ្ញុំអំពីសិល្បៈ និងការរចនា", 
      gradient: "from-pink-400 to-rose-400",
      category: "Creative"
    },
    { 
      text: "ពន្យល់គំនិតអំពីការសរសេរកម្មវិធី", 
      gradient: "from-blue-400 to-indigo-400",
      category: "Technical"
    },
    { 
      text: "ជួយខ្ញុំសរសេររបាយការណ៍ប្រចាំខែ", 
      gradient: "from-orange-400 to-amber-400",
      category: "Business"
    },
    { 
      text: "ជួយខ្ញុំសរសេរសំណើរស្នើសុំច្បាប់", 
      gradient: "from-purple-400 to-violet-400",
      category: "Administrative"
    },
    { 
      text: "ជួយខ្ញុំបង្កើតបទបង្ហាញ PowerPoint", 
      gradient: "from-teal-400 to-cyan-400",
      category: "Presentation"
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-2 sm:p-8 bg-theme-bg transition-theme">
      {/* Header for welcome screen */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigateWithCache('/about', true)}
          className="text-xs text-theme-text-muted hover:text-theme-accent transition-colors px-3 py-1 rounded-md hover:bg-theme-bg-secondary min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2"
          aria-label="អំពី Weteka AI"
          title="អំពី Weteka AI"
        >
          អំពី
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Image
              src="/weteka-logo.png"
              width={32}
              height={32}
              alt="weteka-logo"
              className="w-8 h-8 invert"
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-theme-text mb-4" role="banner">
            Weteka AI ជំនួយការ
          </h1>
          <p className="text-theme-text-secondary font-medium mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto px-4 sm:px-0">
            ខ្ញុំអាចជួយអ្នកក្នុងការសរសេរឯកសារ រាយការណ៍ និងកិច្ចការរដ្ឋបាលផ្សេងៗ
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-2 sm:space-y-3 px-2 sm:px-0" role="list" aria-label="ជម្រើសសំណួររួចរាល់">
          {prompts.map((prompt, index) => (
            <button 
              key={index}
              onClick={() => onSelectPrompt(prompt.text)}
              className="group bg-theme-bg border border-theme-border rounded-xl p-4 cursor-pointer hover:border-theme-accent hover:shadow-md transition-all duration-200 hover:scale-[1.01] w-full text-left min-h-[60px] focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2"
              role="listitem"
              aria-label={`ចាប់ផ្តើមការសន្ទនាជាមួយ: ${prompt.text}`}
              title={`ចុចដើម្បីចាប់ផ្តើម: ${prompt.text}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-theme-text-secondary group-hover:text-theme-text">
                  {prompt.text}
                </p>
                <span 
                  className="text-xs font-medium text-theme-text-muted bg-theme-bg-secondary group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 px-3 py-1 rounded-full border border-theme-border-light group-hover:border-blue-200 dark:group-hover:border-blue-800"
                  aria-label={`ប្រភេទ: ${prompt.category}`}
                >
                  {prompt.category}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-xs text-theme-text-muted" role="note">
            ចុចលើជម្រើសណាមួយខាងលើដើម្បីចាប់ផ្តើមការសន្ទនា
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;