"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  getStorageStats, 
  getStorageUsage, 
  cleanupOldItems, 
  StorageQuotaConfig 
} from '../utils/localStorage';
import { useAnalytics } from './useAnalytics';

interface StorageManagerState {
  stats: {
    used: number;
    usedMB: number;
    maxSize: number;
    maxSizeMB: number;
    utilization: number;
    itemCount: number;
  };
  isNearQuota: boolean;
  isOverQuota: boolean;
  lastCleanup: number | null;
}

export const useStorageManager = (config?: Partial<StorageQuotaConfig>) => {
  const [state, setState] = useState<StorageManagerState>({
    stats: {
      used: 0,
      usedMB: 0,
      maxSize: 5 * 1024 * 1024,
      maxSizeMB: 5,
      utilization: 0,
      itemCount: 0
    },
    isNearQuota: false,
    isOverQuota: false,
    lastCleanup: null
  });
  
  const { trackPerformance, trackError } = useAnalytics();
  
  const updateStats = useCallback(() => {
    try {
      const stats = getStorageStats();
      const isNearQuota = stats.utilization > 0.8; // 80%
      const isOverQuota = stats.utilization > 1.0; // 100%
      
      setState(prev => ({
        ...prev,
        stats,
        isNearQuota,
        isOverQuota
      }));
      
      // Track storage utilization
      trackPerformance('storage_utilization', stats.utilization * 100, {
        usedMB: stats.usedMB,
        itemCount: stats.itemCount
      });
      
      if (isNearQuota && !state.isNearQuota) {
        console.warn('⚠️ localStorage is approaching quota limit:', {
          used: `${stats.usedMB.toFixed(2)}MB`,
          utilization: `${(stats.utilization * 100).toFixed(1)}%`
        });
      }
      
    } catch (error) {
      console.error('Failed to update storage stats:', error);
      trackError('storage_stats_error', String(error));
    }
  }, [trackPerformance, trackError, state.isNearQuota]);
  
  const performCleanup = useCallback(async () => {
    try {
      const startTime = performance.now();
      const freedSpace = cleanupOldItems(config);
      const cleanupTime = performance.now() - startTime;
      
      setState(prevState => ({
        ...prevState,
        lastCleanup: Date.now()
      }));
      
      trackPerformance('storage_cleanup', cleanupTime, {
        freedSpaceKB: Math.round(freedSpace / 1024),
        freedSpaceMB: freedSpace / (1024 * 1024)
      });
      
      // Update stats after cleanup
      setTimeout(updateStats, 100);
      
      return freedSpace;
    } catch (error) {
      console.error('Failed to perform cleanup:', error);
      trackError('storage_cleanup_error', String(error));
      return 0;
    }
  }, [config, trackPerformance, trackError, updateStats]);
  
  const getDetailedUsage = useCallback(() => {
    try {
      const { used, items } = getStorageUsage();
      
      // Group items by prefix to understand usage patterns
      const usage = items.reduce((acc, item) => {
        const prefix = item.key.split('-')[0] || 'other';
        if (!acc[prefix]) {
          acc[prefix] = { count: 0, size: 0, items: [] };
        }
        acc[prefix].count += 1;
        acc[prefix].size += item.size;
        acc[prefix].items.push(item);
        return acc;
      }, {} as Record<string, { count: number; size: number; items: typeof items }>);
      
      return {
        totalUsed: used,
        breakdown: usage,
        oldestItems: items
          .filter(item => !item.key.startsWith('__meta_'))
          .sort((a, b) => a.lastAccessed - b.lastAccessed)
          .slice(0, 10) // Top 10 oldest items
      };
    } catch (error) {
      console.error('Failed to get detailed usage:', error);
      trackError('storage_usage_error', String(error));
      return null;
    }
  }, [trackError]);
  
  // Monitor storage usage periodically
  useEffect(() => {
    updateStats();
    
    const interval = setInterval(updateStats, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [updateStats]);
  
  // Auto-cleanup when approaching quota
  useEffect(() => {
    if (state.isOverQuota || (state.isNearQuota && state.stats.utilization > 0.9)) {
      console.log('🧹 Auto-cleanup triggered due to high storage usage');
      performCleanup();
    }
  }, [state.isOverQuota, state.isNearQuota, state.stats.utilization, performCleanup]);
  
  return {
    ...state,
    updateStats,
    performCleanup,
    getDetailedUsage,
    // Helper methods
    shouldCleanup: state.stats.utilization > 0.8,
    getUsageWarning: () => {
      if (state.isOverQuota) {
        return 'Storage quota exceeded! Data may not be saved properly.';
      }
      if (state.isNearQuota) {
        return 'Storage quota is nearly full. Consider clearing old data.';
      }
      return null;
    }
  };
};