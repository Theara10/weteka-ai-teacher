"use client";

import React, { useEffect } from 'react';

const EnvDebug: React.FC = () => {
  useEffect(() => {
    console.log('=== Environment Debug ===');
    console.log('Client-side environment variables:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')));
    console.log('API key is now securely handled server-side');
    console.log('Client no longer has direct access to API key');
  }, []);

  return null;
};

export default EnvDebug;