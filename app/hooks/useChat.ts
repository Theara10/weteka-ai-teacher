"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ChatMessage, ChatHistory, Message, ContentBlock } from "../types";
import { useAnalytics } from "./useAnalytics";
import { safeSetItem, safeGetItem, initializeStorageManagement } from "../utils/localStorage";

export const useChat = () => {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { trackMessageSent, trackMessageReceived, trackError, trackFeatureUsed, trackPerformance } = useAnalytics();
  
  // Use refs to prevent unnecessary re-renders in effects
  const conversationRef = useRef(conversation);
  const chatHistoriesRef = useRef(chatHistories);
  const currentChatIdRef = useRef(currentChatId);
  
  // Update refs when state changes
  conversationRef.current = conversation;
  chatHistoriesRef.current = chatHistories;
  currentChatIdRef.current = currentChatId;

  // Initialize storage management and load data on mount (single effect)
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize storage management
        initializeStorageManagement();
        
        const startTime = performance.now();
        
        // Load all data in parallel
        const savedConversation = safeGetItem('weteka-current-conversation');
        const savedChatId = safeGetItem('weteka-current-chat-id');
        const savedHistories = safeGetItem('weteka-chat-histories');
        const wasLoading = sessionStorage.getItem('weteka-chat-loading') === 'true';

        // Parse and set conversation
        if (savedConversation) {
          try {
            const parsedConversation = JSON.parse(savedConversation);
            setConversation(parsedConversation);
          } catch (e) {
            console.error('Error loading conversation:', e);
            trackError('data_loading_error', 'Failed to parse conversation');
          }
        }

        // Set current chat ID
        if (savedChatId) {
          setCurrentChatId(savedChatId);
        }

        // Parse and set chat histories
        if (savedHistories) {
          try {
            const parsedHistories = JSON.parse(savedHistories);
            setChatHistories(parsedHistories);
          } catch (e) {
            console.error('Error loading chat histories:', e);
            trackError('data_loading_error', 'Failed to parse chat histories');
          }
        }

        // Restore loading state if user navigated away during API call
        if (wasLoading) {
          setIsLoading(true);
          // Clear loading state after a delay
          setTimeout(() => {
            setIsLoading(false);
            sessionStorage.removeItem('weteka-chat-loading');
          }, 1000);
        }
        
        const loadTime = performance.now() - startTime;
        trackPerformance('data_initialization', loadTime);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize chat data:', error);
        trackError('initialization_error', String(error));
        setIsInitialized(true); // Still mark as initialized to prevent infinite loops
      }
    };
    
    initializeData();
  }, [trackError, trackPerformance]); // Add dependencies

  // Create stable track functions with useCallback to prevent effect re-runs
  const stableTrackError = useCallback((type: string, details: string) => {
    trackError(type, details);
  }, [trackError]);
  
  const stableTrackPerformance = useCallback((metric: string, value: number) => {
    trackPerformance(metric, value);
  }, [trackPerformance]);

  // Optimized storage effect - only save when initialized and data changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveData = async () => {
      const startTime = performance.now();
      
      try {
        // Save conversation
        if (conversation.length > 0) {
          const success = safeSetItem('weteka-current-conversation', JSON.stringify(conversation));
          if (!success) {
            stableTrackError('storage_error', 'Failed to save conversation');
          }
        }
        
        // Save current chat ID
        if (currentChatId) {
          safeSetItem('weteka-current-chat-id', currentChatId);
        }
        
        // Save chat histories
        if (chatHistories.length > 0) {
          const success = safeSetItem('weteka-chat-histories', JSON.stringify(chatHistories));
          if (!success) {
            stableTrackError('storage_error', 'Failed to save chat histories');
          }
        }
        
        const saveTime = performance.now() - startTime;
        stableTrackPerformance('data_save', saveTime);
      } catch (error) {
        console.error('Failed to save data:', error);
        stableTrackError('storage_error', String(error));
      }
    };
    
    // Debounce saves to prevent excessive writes
    const timeoutId = setTimeout(saveData, 500);
    
    return () => clearTimeout(timeoutId);
  }, [conversation, currentChatId, chatHistories, isInitialized, stableTrackError, stableTrackPerformance]);

  // Memoize utility functions to prevent recreation on every render
  const extractTextFromMessage = useCallback((message: Message): string => {
    return message.content
      .map((block: ContentBlock) => {
        switch (block.type) {
          case "text":
            return block.text || "";
          case "image":
            return "[Image]";
          default:
            return "";
        }
      })
      .join("\n");
  }, []);

  const generateChatTitle = useCallback((firstMessage: string): string => {
    const words = firstMessage.trim().split(' ');
    return words.slice(0, 6).join(' ') + (words.length > 6 ? '...' : '');
  }, []);

  // Memoize the saveCurrentChat function with stable dependencies
  const saveCurrentChat = useCallback((messages: ChatMessage[]) => {
    if (messages.length === 0 || !currentChatIdRef.current) return;

    const currentHistories = chatHistoriesRef.current;
    const currentId = currentChatIdRef.current;
    const existingChatIndex = currentHistories.findIndex(c => c.id === currentId);
    const title = generateChatTitle(messages[0]?.content || 'New Chat');
    const now = new Date();

    if (existingChatIndex >= 0) {
      const updatedHistories = [...currentHistories];
      updatedHistories[existingChatIndex] = {
        ...updatedHistories[existingChatIndex],
        messages,
        title,
        updatedAt: now
      };
      setChatHistories(updatedHistories);
    } else {
      const newChat: ChatHistory = {
        id: currentId,
        title,
        messages,
        createdAt: now,
        updatedAt: now
      };
      setChatHistories(prev => [newChat, ...prev]);
    }
  }, [generateChatTitle]); // Add generateChatTitle dependency

  // Create stable tracking function
  const stableTrackFeatureUsed = useCallback((feature: string, details?: any) => {
    trackFeatureUsed(feature, details);
  }, [trackFeatureUsed]);

  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setConversation([]);
    // Clear conversation from localStorage but keep the new chat ID
    localStorage.removeItem('weteka-current-conversation');
    safeSetItem('weteka-current-chat-id', newChatId);
    stableTrackFeatureUsed('new_chat');
  }, [stableTrackFeatureUsed]);

  const switchToChat = useCallback((chatId: string) => {
    const chat = chatHistoriesRef.current.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setConversation(chat.messages);
      // Update localStorage when switching chats
      safeSetItem('weteka-current-chat-id', chatId);
      safeSetItem('weteka-current-conversation', JSON.stringify(chat.messages));
      stableTrackFeatureUsed('switch_chat', { messagesInChat: chat.messages.length });
    }
  }, [stableTrackFeatureUsed]);

  // Create stable tracking functions to prevent sendMessage from changing unnecessarily
  const stableTrackMessageSent = useCallback((length: number, language: string) => {
    trackMessageSent(length, language);
  }, [trackMessageSent]);
  
  const stableTrackMessageReceived = useCallback((length: number, responseTime: number) => {
    trackMessageReceived(length, responseTime);
  }, [trackMessageReceived]);

  const sendMessage = useCallback(async (inputValue: string) => {
    if (!inputValue.trim()) return;

    const startTime = Date.now();
    console.log('Sending message:', inputValue);
    
    // Track message sent
    stableTrackMessageSent(inputValue.length, inputValue.match(/[\u1780-\u17FF]/) ? 'khmer' : 'other');
    
    // Use current values from refs to avoid stale closures
    const currentConversation = conversationRef.current;
    const currentId = currentChatIdRef.current;

    if (!currentId) {
      const newChatId = Date.now().toString();
      setCurrentChatId(newChatId);
    }

    const userMessage: ChatMessage = { role: "user", content: inputValue };
    const updatedConversation = [...currentConversation, userMessage];
    
    setIsLoading(true);
    setConversation(updatedConversation);
    
    // Store loading state for persistence during navigation
    sessionStorage.setItem('weteka-chat-loading', 'true');

    try {
      // Call the secure backend API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentConversation,
          inputValue: inputValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      const assistantResponse = data.response;
      const assistantMessage: ChatMessage = { role: "assistant", content: assistantResponse };
      const finalConversation = [...updatedConversation, assistantMessage];
      
      // Track successful response
      const responseTime = Date.now() - startTime;
      stableTrackMessageReceived(assistantResponse.length, responseTime);
      
      setConversation(finalConversation);
      saveCurrentChat(finalConversation);
      
    } catch (error) {
      console.error("Detailed error:", error);
      
      // Track error
      const errorType = error instanceof Error ? error.message : 'unknown_error';
      stableTrackError('api_request_failed', errorType);
      
      // Better error handling with user-friendly messages
      let errorContent = "";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorContent = `❌ **បញ្ហា API Key**\n\nសូមពិនិត្យ API Key របស់អ្នក។ ត្រូវតែមាន API Key ត្រឹមត្រូវដើម្បីប្រើប្រាស់ Weteka AI។\n\n**វិធីដោះស្រាយ:**\n1. បង្កើតឯកសារ \`.env.local\`\n2. បន្ថែម: API_KEY=your_api_key_here\n3. ចាប់ផ្តើមម៉ាស៊ីនម្ដងទៀត`;
        } else if (error.message.includes('rate limit') || error.message.includes('429')) {
          errorContent = `⏰ **អ្នកបានប្រើប្រាស់ច្រើនពេក**\n\nសូមរង់ចាំបន្តិចម្ដង មុននឹងបន្តសួរសំណួរ។ នេះគឺដើម្បីធានាប្រព័ន្ធដំណើរការល្អ។\n\n**សូមព្យាយាមម្ដងទៀតក្នុងរយៈពេល 1-2 នាទី។**`;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorContent = `🌐 **បញ្ហាបណ្ដាញ**\n\nមិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ។ សូមពិនិត្យការភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក។\n\n**វិធីដោះស្រាយ:**\n- ពិនិត្យការភ្ជាប់អ៊ីនធឺណិត\n- ព្យាយាមម្ដងទៀតក្នុងរយៈពេលបន្តិច`;
        } else {
          errorContent = `❌ **បញ្ហាបច្ចេកទេស**\n\n${error.message}\n\n**វិធីដោះស្រាយ:**\n- ព្យាយាមសួរសំណួរម្ដងទៀត\n- ប្រសិនបើបញ្ហានៅតែមាន សូមផ្ទុកទំព័រឡើងវិញ`;
        }
      } else {
        errorContent = `❌ **មានបញ្ហាមិនស្គាល់**\n\nមានបញ្ហាបច្ចេកទេសបានកើតឡើង។ សូមព្យាយាមម្ដងទៀត។`;
      }
      
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: errorContent,
      };
      const finalConversation = [...updatedConversation, errorMessage];
      setConversation(finalConversation);
      saveCurrentChat(finalConversation);
    } finally {
      setIsLoading(false);
      // Clear loading state from session storage
      sessionStorage.removeItem('weteka-chat-loading');
    }
  }, [saveCurrentChat, stableTrackMessageSent, stableTrackMessageReceived, stableTrackError]); // Removed conversation and currentChatId from deps

  const updateMessage = useCallback((index: number, newContent: string) => {
    const updatedConversation = [...conversationRef.current];
    updatedConversation[index].content = newContent;
    setConversation(updatedConversation);
    saveCurrentChat(updatedConversation);
    stableTrackFeatureUsed('edit_message', { messageIndex: index, newLength: newContent.length });
  }, [saveCurrentChat, stableTrackFeatureUsed]);

  // Memoize the return object to prevent unnecessary re-renders in consuming components
  return useMemo(() => ({
    conversation,
    isLoading,
    chatHistories,
    currentChatId,
    createNewChat,
    switchToChat,
    sendMessage,
    updateMessage,
    isInitialized
  }), [
    conversation,
    isLoading,
    chatHistories,
    currentChatId,
    createNewChat,
    switchToChat,
    sendMessage,
    updateMessage,
    isInitialized
  ]);
};