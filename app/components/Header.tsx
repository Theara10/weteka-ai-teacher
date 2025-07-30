"use client";

import React from "react";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="border-b border-theme-border bg-theme-bg shadow-sm transition-theme">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Image
                src="/weteka-logo.png"
                width={24}
                height={24}
                alt="weteka-logo"
                className="w-6 h-6 invert"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-theme-text leading-tight">
                Weteka AI ជំនួយការ
              </h1>
              <p className="text-sm text-theme-text-muted">
                Your Learning Assistant
              </p>
            </div>
          </div>
          
          {/* Theme Toggle and Status */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-theme-bg-secondary border border-theme-border hover:bg-theme-bg-tertiary transition-theme group focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-theme-text-secondary group-hover:text-theme-text transition-colors" />
              ) : (
                <Sun className="h-4 w-4 text-theme-text-secondary group-hover:text-theme-text transition-colors" />
              )}
            </button>
            
            {/* Status */}
            <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;