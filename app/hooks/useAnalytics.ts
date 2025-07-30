"use client";

import { useEffect, useCallback, useRef } from 'react';
import { getStorageStats } from '../utils/localStorage';

interface AnalyticsEvent {
  type: 'page_view' | 'message_sent' | 'message_received' | 'error' | 'feature_used' | 'performance' | 'render_count';
  data?: Record<string, any>;
  timestamp: number;
}

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  storageUsage: {
    used: number;
    utilization: number;
    itemCount: number;
  };
}

export const useAnalytics = () => {
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const lastRenderTimeRef = useRef(Date.now());
  
  // Track component renders
  useEffect(() => {
    const now = Date.now();
    const renderTime = now - lastRenderTimeRef.current;
    
    renderCountRef.current += 1;
    renderTimesRef.current.push(renderTime);
    
    // Keep only last 100 render times for memory efficiency
    if (renderTimesRef.current.length > 100) {
      renderTimesRef.current = renderTimesRef.current.slice(-100);
    }
    
    lastRenderTimeRef.current = now;
    
    // Log excessive re-renders in development
    if (process.env.NODE_ENV === 'development' && renderCountRef.current % 10 === 0) {
      console.warn(`📊 Analytics hook has re-rendered ${renderCountRef.current} times`);
    }
  });
  
  const track = useCallback((eventType: AnalyticsEvent['type'], data?: Record<string, any>) => {
    try {
      const event: AnalyticsEvent = {
        type: eventType,
        data,
        timestamp: Date.now(),
      };

      // Store in localStorage for local analytics
      const existingEvents = localStorage.getItem('weteka-analytics');
      const events: AnalyticsEvent[] = existingEvents ? JSON.parse(existingEvents) : [];
      events.push(event);

      // Keep only last 1000 events to prevent localStorage bloat
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }

      localStorage.setItem('weteka-analytics', JSON.stringify(events));

      // Console log for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Analytics: ${eventType}`, data);
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }, []);

  const trackPageView = useCallback((page: string) => {
    track('page_view', { page });
  }, [track]);

  const trackMessageSent = useCallback((messageLength: number, language?: string) => {
    track('message_sent', { messageLength, language });
  }, [track]);

  const trackMessageReceived = useCallback((responseLength: number, responseTime: number) => {
    track('message_received', { responseLength, responseTime });
  }, [track]);

  const trackError = useCallback((errorType: string, errorMessage?: string) => {
    track('error', { errorType, errorMessage });
  }, [track]);

  const trackFeatureUsed = useCallback((feature: string, details?: Record<string, any>) => { 
    track('feature_used', { feature, ...details });
  }, [track]);
  
  const trackPerformance = useCallback((metric: string, value: number, details?: Record<string, any>) => {
    track('performance', { metric, value, ...details });
  }, [track]);
  
  const trackRenderCount = useCallback((componentName: string, renderCount: number) => {
    track('render_count', { componentName, renderCount });
  }, [track]);

  const getAnalytics = useCallback(() => {
    try {
      const events = localStorage.getItem('weteka-analytics');
      return events ? JSON.parse(events) : [];
    } catch {
      return [];
    }
  }, []);

  const getAnalyticsSummary = useCallback(() => {
    const events = getAnalytics();
    const summary = {
      totalEvents: events.length,
      pageViews: events.filter((e: AnalyticsEvent) => e.type === 'page_view').length,
      messagesSent: events.filter((e: AnalyticsEvent) => e.type === 'message_sent').length,
      messagesReceived: events.filter((e: AnalyticsEvent) => e.type === 'message_received').length,
      errors: events.filter((e: AnalyticsEvent) => e.type === 'error').length,
      featuresUsed: events.filter((e: AnalyticsEvent) => e.type === 'feature_used').length,
      performanceEvents: events.filter((e: AnalyticsEvent) => e.type === 'performance').length,
      renderEvents: events.filter((e: AnalyticsEvent) => e.type === 'render_count').length,
      lastActive: events.length > 0 ? new Date(Math.max(...events.map((e: AnalyticsEvent) => e.timestamp))) : null,
    };
    return summary;
  }, [getAnalytics]);
  
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    const storageStats = getStorageStats();
    const averageRenderTime = renderTimesRef.current.length > 0 
      ? renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length
      : 0;
    
    return {
      renderCount: renderCountRef.current,
      lastRenderTime: lastRenderTimeRef.current,
      averageRenderTime,
      storageUsage: {
        used: storageStats.used,
        utilization: storageStats.utilization,
        itemCount: storageStats.itemCount
      }
    };
  }, []);

  // Track page view on mount
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  return {
    track,
    trackPageView,
    trackMessageSent,
    trackMessageReceived,
    trackError,
    trackFeatureUsed,
    trackPerformance,
    trackRenderCount,
    getAnalytics,
    getAnalyticsSummary,
    getPerformanceMetrics,
  };
};