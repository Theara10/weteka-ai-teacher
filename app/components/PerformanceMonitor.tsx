"use client";

import { useEffect, useState, useRef } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
  trackRenders?: boolean;
  showDebugInfo?: boolean;
}

/**
 * Performance monitoring wrapper component
 * Tracks render counts and performance metrics for wrapped components
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  componentName,
  children,
  trackRenders = true,
  showDebugInfo = process.env.NODE_ENV === 'development'
}) => {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef(Date.now());
  const lastRenderTimeRef = useRef(Date.now());
  const [debugInfo, setDebugInfo] = useState<{
    renderCount: number;
    averageRenderTime: number;
    lastRenderTime: number;
  } | null>(null);
  
  const { trackRenderCount, trackPerformance } = useAnalytics();
  
  useEffect(() => {
    const now = Date.now();
    renderCountRef.current += 1;
    const renderTime = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;
    
    if (trackRenders) {
      trackRenderCount(componentName, renderCountRef.current);
      
      // Track excessive re-renders
      if (renderCountRef.current > 10 && renderCountRef.current % 5 === 0) {
        trackPerformance('excessive_renders', renderCountRef.current, {
          componentName,
          renderTime
        });
      }
    }
    
    if (showDebugInfo) {
      const timeSinceMount = now - mountTimeRef.current;
      const averageRenderTime = timeSinceMount / renderCountRef.current;
      
      setDebugInfo({
        renderCount: renderCountRef.current,
        averageRenderTime,
        lastRenderTime: renderTime
      });
      
      // Log warning for excessive renders
      if (renderCountRef.current > 20) {
        console.warn(`🚨 ${componentName} has rendered ${renderCountRef.current} times`);
      }
    }
  }, [trackRenders, showDebugInfo, trackRenderCount, componentName, trackPerformance]);
  
  return (
    <>
      {children}
      {showDebugInfo && debugInfo && (
        <div 
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            maxWidth: '200px'
          }}
        >
          <div><strong>{componentName}</strong></div>
          <div>Renders: {debugInfo.renderCount}</div>
          <div>Avg: {debugInfo.averageRenderTime.toFixed(1)}ms</div>
          <div>Last: {debugInfo.lastRenderTime}ms</div>
        </div>
      )}
    </>
  );
};

/**
 * Hook for tracking component performance without wrapper component
 */
export const usePerformanceTracking = (componentName: string) => {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef(Date.now());
  const { trackRenderCount, trackPerformance } = useAnalytics();
  
  useEffect(() => {
    renderCountRef.current += 1;
    trackRenderCount(componentName, renderCountRef.current);
    
    // Track excessive re-renders
    if (renderCountRef.current > 10 && renderCountRef.current % 5 === 0) {
      const timeSinceMount = Date.now() - mountTimeRef.current;
      trackPerformance('excessive_renders', renderCountRef.current, {
        componentName,
        timeSinceMount
      });
    }
  });
  
  return renderCountRef.current;
};