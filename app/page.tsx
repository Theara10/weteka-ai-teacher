"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useChat } from "./hooks/useChat";
import { useUI } from "./hooks/useUI";
import { useNavigation } from "./hooks/useNavigation";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessageComponent from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import EnvDebug from "./components/EnvDebug";
import HelpMenu from "./components/HelpMenu";
import ChatStateIndicator from "./components/ChatStateIndicator";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [forceShowChat, setForceShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if we should force show chat view on mount
  useEffect(() => {
    const shouldForceChat = sessionStorage.getItem('weteka-force-chat-view') === 'true';
    if (shouldForceChat) {
      setForceShowChat(true);
      sessionStorage.removeItem('weteka-force-chat-view');
    }
  }, []);

  const {
    conversation,
    isLoading,
    sendMessage,
    updateMessage,
  } = useChat();

  const { navigateWithCache } = useNavigation();

  const {
    editingMessageIndex,
    editedContent,
    startEditing,
    saveEditedMessage,
    cancelEditing,
    copyToClipboard,
    shareToMessenger,
    setEditedContent,
  } = useUI();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentInput = inputValue;
    setInputValue("");
    await sendMessage(currentInput);
  };


  const handleSaveEditedMessage = () => {
    const result = saveEditedMessage();
    if (result.index !== null) {
      updateMessage(result.index, result.content);
    }
    cancelEditing();
  };

  return (
    <div className="min-h-screen bg-theme-bg-secondary relative transition-theme">
      <EnvDebug />
      {/* Subtle texture background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
        backgroundImage: `
          radial-gradient(circle at 1px 1px, var(--theme-border) 1px, transparent 0),
          linear-gradient(0deg, transparent 24%, var(--theme-border) 25%, var(--theme-border) 26%, transparent 27%, transparent 74%, var(--theme-border) 75%, var(--theme-border) 76%, transparent 77%)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Simple branding header for chat page */}
        {(conversation.length > 0 || forceShowChat) && (
          <div className="bg-theme-bg border-b border-theme-border-light transition-theme">
            <div className="max-w-full mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/weteka-logo.png"
                      width={16}
                      height={16}
                      alt="weteka-logo"
                      className="w-4 h-4 invert"
                    />
                  </div>
                  <span className="text-sm font-semibold text-theme-text truncate">Weteka AI</span>
                </div>
                <button
                  onClick={() => navigateWithCache('/about', true)}
                  className="text-xs text-theme-text-muted hover:text-theme-accent transition-colors px-3 py-1 rounded-md hover:bg-theme-bg-secondary min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                  aria-label="អំពី Weteka AI"
                >
                  អំពី
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome message when no conversation */}
        {conversation.length === 0 && !forceShowChat && (
          <WelcomeScreen onSelectPrompt={setInputValue} />
        )}

        {/* Chat Messages */}
        {(conversation.length > 0 || forceShowChat) && (
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {conversation.length === 0 && forceShowChat && (
                <div className="text-center py-12">
                  <div className="text-theme-text-muted text-sm">
                    ការសន្ទនារបស់អ្នកបានបន្តពីមុន...
                  </div>
                </div>
              )}
              {conversation.map((message, index) => (
                <ChatMessageComponent
                  key={index}
                  message={message}
                  index={index}
                  isEditing={editingMessageIndex === index}
                  editedContent={editedContent}
                  onStartEditing={startEditing}
                  onSaveEdit={handleSaveEditedMessage}
                  onCancelEdit={cancelEditing}
                  onContentChange={setEditedContent}
                  onCopy={copyToClipboard}
                  onShare={shareToMessenger}
                />
              ))}
              
              {/* Loading Animation */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 sm:space-x-3 w-full max-w-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/weteka-logo.png"
                        width={20}
                        height={20}
                        alt="weteka-logo"
                        className="w-5 h-5 invert"
                      />
                    </div>
                    <div className="flex flex-col space-y-1 min-w-0 flex-1">
                      <div className="text-xs text-theme-text-muted px-1">Weteka AI</div>
                      <div className="bg-theme-bg border border-theme-border px-4 py-3 rounded-2xl shadow-sm max-w-full">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-theme-text-muted rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-theme-text-muted rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-theme-text-muted rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-theme-text-muted truncate">កំពុងគិត...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to anchor scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <ChatInput
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
        />

        {/* Help Menu */}
        <HelpMenu />
        
        {/* Chat State Indicator */}
        <ChatStateIndicator />
      </div>
    </div>
  );
};

export default App;