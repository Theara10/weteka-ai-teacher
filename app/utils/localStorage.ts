/**
 * LocalStorage utility functions with quota management and automatic cleanup
 * Prevents storage quota exceeded errors and manages storage efficiently
 */

export interface StorageItem {
  key: string;
  size: number;
  lastAccessed: number;
}

export interface StorageQuotaConfig {
  maxSize: number; // Maximum size in bytes (default: 5MB)
  cleanupThreshold: number; // Cleanup when reaching this percentage (default: 0.8 = 80%)
  maxItems: number; // Maximum number of items to keep
}

const DEFAULT_CONFIG: StorageQuotaConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  cleanupThreshold: 0.8, // 80%
  maxItems: 1000
};

/**
 * Calculate the size of a string in bytes (UTF-8)
 */
export const getStringSize = (str: string): number => {
  return new Blob([str]).size;
};

/**
 * Get the current localStorage usage
 */
export const getStorageUsage = (): { used: number; items: StorageItem[] } => {
  let totalSize = 0;
  const items: StorageItem[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      const size = getStringSize(key) + getStringSize(value);
      totalSize += size;
      
      // Try to get last accessed time from metadata or use current time
      const lastAccessed = getItemMetadata(key)?.lastAccessed || Date.now();
      
      items.push({
        key,
        size,
        lastAccessed
      });
    }
  }
  
  return { used: totalSize, items };
};

/**
 * Get metadata for a storage item
 */
const getItemMetadata = (key: string): { lastAccessed: number } | null => {
  try {
    const metaKey = `__meta_${key}`;
    const metadata = localStorage.getItem(metaKey);
    return metadata ? JSON.parse(metadata) : null;
  } catch {
    return null;
  }
};

/**
 * Set metadata for a storage item
 */
const setItemMetadata = (key: string, metadata: { lastAccessed: number }): void => {
  try {
    const metaKey = `__meta_${key}`;
    localStorage.setItem(metaKey, JSON.stringify(metadata));
  } catch {
    // Ignore metadata storage failures
  }
};

/**
 * Clean up old items to free space
 */
export const cleanupOldItems = (config: Partial<StorageQuotaConfig> = {}): number => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { used, items } = getStorageUsage();
  
  if (used <= finalConfig.maxSize * finalConfig.cleanupThreshold) {
    return 0; // No cleanup needed
  }
  
  // Sort items by last accessed time (oldest first)
  const sortedItems = items
    .filter(item => !item.key.startsWith('__meta_')) // Don't clean up metadata
    .sort((a, b) => a.lastAccessed - b.lastAccessed);
  
  let freedSpace = 0;
  let itemsRemoved = 0;
  const targetSize = finalConfig.maxSize * 0.6; // Clean up to 60% capacity
  
  for (const item of sortedItems) {
    if (used - freedSpace <= targetSize || itemsRemoved >= Math.floor(sortedItems.length * 0.3)) {
      break; // Stop when we've freed enough space or removed too many items
    }
    
    try {
      localStorage.removeItem(item.key);
      localStorage.removeItem(`__meta_${item.key}`); // Remove metadata too
      freedSpace += item.size;
      itemsRemoved++;
    } catch (error) {
      console.warn(`Failed to remove item ${item.key}:`, error);
    }
  }
  
  console.log(`localStorage cleanup: Removed ${itemsRemoved} items, freed ${Math.round(freedSpace / 1024)}KB`);
  return freedSpace;
};

/**
 * Safely set an item to localStorage with quota management
 */
export const safeSetItem = (
  key: string, 
  value: string, 
  config: Partial<StorageQuotaConfig> = {}
): boolean => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  try {
    const itemSize = getStringSize(key) + getStringSize(value);
    const { used } = getStorageUsage();
    
    // Check if adding this item would exceed the quota
    if (used + itemSize > finalConfig.maxSize) {
      console.log(`localStorage quota would be exceeded. Attempting cleanup...`);
      const freedSpace = cleanupOldItems(finalConfig);
      
      // Check again after cleanup
      const { used: newUsed } = getStorageUsage();
      if (newUsed + itemSize > finalConfig.maxSize) {
        console.error(`Cannot store item: would exceed quota even after cleanup`);
        return false;
      }
    }
    
    // Store the item
    localStorage.setItem(key, value);
    
    // Update metadata
    setItemMetadata(key, { lastAccessed: Date.now() });
    
    return true;
  } catch (error) {
    console.error(`Failed to store item ${key}:`, error);
    
    // If storage failed, try cleanup and retry once
    try {
      cleanupOldItems(finalConfig);
      localStorage.setItem(key, value);
      setItemMetadata(key, { lastAccessed: Date.now() });
      return true;
    } catch (retryError) {
      console.error(`Failed to store item ${key} even after cleanup:`, retryError);
      return false;
    }
  }
};

/**
 * Safely get an item from localStorage and update access time
 */
export const safeGetItem = (key: string): string | null => {
  try {
    const value = localStorage.getItem(key);
    if (value !== null) {
      // Update last accessed time
      setItemMetadata(key, { lastAccessed: Date.now() });
    }
    return value;
  } catch (error) {
    console.error(`Failed to get item ${key}:`, error);
    return null;
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = (): {
  used: number;
  usedMB: number;
  maxSize: number;
  maxSizeMB: number;
  utilization: number;
  itemCount: number;
} => {
  const { used, items } = getStorageUsage();
  const maxSize = DEFAULT_CONFIG.maxSize;
  
  return {
    used,
    usedMB: used / (1024 * 1024),
    maxSize,
    maxSizeMB: maxSize / (1024 * 1024),
    utilization: used / maxSize,
    itemCount: items.length
  };
};

/**
 * Initialize storage management (call once on app startup)
 */
export const initializeStorageManagement = (): void => {
  // Clean up any orphaned metadata
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('__meta_')) {
      const originalKey = key.replace('__meta_', '');
      if (!localStorage.getItem(originalKey)) {
        localStorage.removeItem(key);
      }
    }
  }
  
  // Perform initial cleanup if needed
  const stats = getStorageStats();
  if (stats.utilization > DEFAULT_CONFIG.cleanupThreshold) {
    cleanupOldItems();
  }
  
  console.log('localStorage management initialized:', {
    used: `${stats.usedMB.toFixed(2)}MB`,
    utilization: `${(stats.utilization * 100).toFixed(1)}%`,
    items: stats.itemCount
  });
};