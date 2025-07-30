"use client";

import React, { useEffect, useState } from "react";

const ChatStateIndicator: React.FC = () => {
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    // Check if user is returning from navigation
    const wasNavigating = sessionStorage.getItem('weteka-preserve-state') === 'true';
    
    if (wasNavigating) {
      setIsReturning(true);
      // Clear the flag after showing the indicator
      setTimeout(() => {
        setIsReturning(false);
        sessionStorage.removeItem('weteka-preserve-state');
        sessionStorage.removeItem('weteka-navigation-timestamp');
      }, 2000);
    }
  }, []);

  if (!isReturning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-theme-accent text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse">
      ត្រលប់មកការសន្ទនា
    </div>
  );
};

export default ChatStateIndicator;