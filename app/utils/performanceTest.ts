/**
 * Performance testing utilities for localStorage optimizations
 * Run these functions in browser console to test the optimizations
 */

import { 
  safeSetItem, 
  safeGetItem, 
  getStorageStats, 
  cleanupOldItems,
  initializeStorageManagement 
} from './localStorage';

export const runStoragePerformanceTest = () => {
  console.log('🧪 Running localStorage performance test...');
  
  // Initialize storage management
  initializeStorageManagement();
  
  const startTime = performance.now();
  
  // Test 1: Generate large amount of test data
  console.log('📝 Generating test data...');
  const testData = {
    conversations: Array.from({ length: 100 }, (_, i) => ({
      id: `chat-${i}`,
      messages: Array.from({ length: 50 }, (_, j) => ({
        role: j % 2 === 0 ? 'user' : 'assistant',
        content: `This is test message ${j} in conversation ${i}. It contains some reasonable amount of text to simulate real chat messages with various content lengths and types.`
      })),
      timestamp: Date.now() - i * 60000
    })),
    analytics: Array.from({ length: 500 }, (_, i) => ({
      type: 'message_sent',
      timestamp: Date.now() - i * 1000,
      data: { messageLength: Math.floor(Math.random() * 200) + 50 }
    }))
  };
  
  const dataString = JSON.stringify(testData);
  const dataSizeKB = Math.round(dataString.length / 1024);
  console.log(`📊 Generated ${dataSizeKB}KB of test data`);
  
  // Test 2: Store data using safe storage
  console.log('💾 Testing safe storage...');
  const storageStart = performance.now();
  
  const storageResults = {
    successful: 0,
    failed: 0
  };
  
  // Store conversation data
  testData.conversations.forEach((conv, i) => {
    const success = safeSetItem(`test-conversation-${i}`, JSON.stringify(conv));
    if (success) {
      storageResults.successful++;
    } else {
      storageResults.failed++;
    }
  });
  
  // Store analytics data
  const analyticsSuccess = safeSetItem('test-analytics', JSON.stringify(testData.analytics));
  if (analyticsSuccess) storageResults.successful++;
  else storageResults.failed++;
  
  const storageTime = performance.now() - storageStart;
  console.log(`✅ Storage test completed: ${storageResults.successful} successful, ${storageResults.failed} failed (${storageTime.toFixed(1)}ms)`);
  
  // Test 3: Check storage stats
  console.log('📈 Checking storage statistics...');
  const stats = getStorageStats();
  console.log({
    used: `${stats.usedMB.toFixed(2)}MB`,
    utilization: `${(stats.utilization * 100).toFixed(1)}%`,
    items: stats.itemCount
  });
  
  // Test 4: Test retrieval performance
  console.log('🔍 Testing retrieval performance...');
  const retrievalStart = performance.now();
  
  const retrievalResults = {
    successful: 0,
    failed: 0
  };
  
  // Retrieve some conversations
  for (let i = 0; i < Math.min(10, testData.conversations.length); i++) {
    const retrieved = safeGetItem(`test-conversation-${i}`);
    if (retrieved) {
      try {
        JSON.parse(retrieved);
        retrievalResults.successful++;
      } catch {
        retrievalResults.failed++;
      }
    } else {
      retrievalResults.failed++;
    }
  }
  
  const retrievalTime = performance.now() - retrievalStart;
  console.log(`✅ Retrieval test completed: ${retrievalResults.successful} successful, ${retrievalResults.failed} failed (${retrievalTime.toFixed(1)}ms)`);
  
  // Test 5: Test cleanup performance
  console.log('🧹 Testing cleanup performance...');
  const cleanupStart = performance.now();
  const freedSpace = cleanupOldItems();
  const cleanupTime = performance.now() - cleanupStart;
  
  console.log(`✅ Cleanup freed ${Math.round(freedSpace / 1024)}KB in ${cleanupTime.toFixed(1)}ms`);
  
  // Final stats
  const finalStats = getStorageStats();
  console.log('📊 Final storage statistics:', {
    used: `${finalStats.usedMB.toFixed(2)}MB`,
    utilization: `${(finalStats.utilization * 100).toFixed(1)}%`,
    items: finalStats.itemCount
  });
  
  const totalTime = performance.now() - startTime;
  console.log(`🎉 Performance test completed in ${totalTime.toFixed(1)}ms`);
  
  // Cleanup test data
  console.log('🧽 Cleaning up test data...');
  for (let i = 0; i < testData.conversations.length; i++) {
    localStorage.removeItem(`test-conversation-${i}`);
    localStorage.removeItem(`__meta_test-conversation-${i}`);
  }
  localStorage.removeItem('test-analytics');
  localStorage.removeItem('__meta_test-analytics');
  
  return {
    totalTime,
    storageTime,
    retrievalTime,
    cleanupTime,
    storageResults,
    retrievalResults,
    finalStats
  };
};

/**
 * Test render performance by simulating component re-renders
 */
export const simulateRenderTest = () => {
  console.log('🎭 Simulating render performance test...');
  
  const renderTimes: number[] = [];
  const renderCount = 100;
  
  for (let i = 0; i < renderCount; i++) {
    const start = performance.now();
    
    // Simulate expensive operations that might happen during renders
    const mockData = {
      conversation: Array(10).fill(null).map((_, j) => ({
        role: j % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${j}`
      })),
      chatHistories: Array(20).fill(null).map((_, j) => ({
        id: `chat-${j}`,
        title: `Chat ${j}`,
        messages: Array(5).fill(null).map((_, k) => ({
          role: k % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${k}`
        }))
      }))
    };
    
    // Simulate JSON serialization (common in localStorage operations)
    const serialized = JSON.stringify(mockData);
    JSON.parse(serialized);
    
    const renderTime = performance.now() - start;
    renderTimes.push(renderTime);
  }
  
  const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
  const maxRenderTime = Math.max(...renderTimes);
  const minRenderTime = Math.min(...renderTimes);
  
  console.log('📊 Render performance results:', {
    renders: renderCount,
    averageTime: `${avgRenderTime.toFixed(2)}ms`,
    maxTime: `${maxRenderTime.toFixed(2)}ms`,
    minTime: `${minRenderTime.toFixed(2)}ms`,
    totalTime: `${renderTimes.reduce((a, b) => a + b, 0).toFixed(2)}ms`
  });
  
  return {
    renderCount,
    avgRenderTime,
    maxRenderTime,
    minRenderTime,
    totalTime: renderTimes.reduce((a, b) => a + b, 0)
  };
};

// Add to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).wetekaPerformanceTest = {
    runStoragePerformanceTest,
    simulateRenderTest
  };
}