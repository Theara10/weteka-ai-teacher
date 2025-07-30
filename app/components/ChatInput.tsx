"use client";

import React, { useRef, useEffect } from "react";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="bg-theme-bg border-t border-theme-border transition-theme">
      <div className="max-w-3xl mx-auto p-2 sm:p-6">
        <form onSubmit={onSubmit}>
          <div className="flex items-center space-x-2">
            {/* Text input area */}
            <div className="flex-1">
              <label htmlFor="chat-input" className="sr-only">
                សរសេរសារអ្នកនៅទីនេះ (Type your message here)
              </label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                className="w-full resize-none border border-theme-border rounded-lg bg-theme-bg-secondary p-3 text-theme-text placeholder-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent focus:bg-theme-bg transition-all"
                placeholder="វាយបញ្ចូលសាររបស់អ្នកនៅទីនេះ..."
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{ height: '40px', maxHeight: '120px' }}
                aria-label="សរសេរសារអ្នកនៅទីនេះ"
                aria-describedby="input-help"
                disabled={isLoading}
              />
              <div id="input-help" className="sr-only">
                ចុច Enter ដើម្បីផ្ញើ ឬ Shift+Enter សម្រាប់បន្ទាត់ថ្មី
              </div>
            </div>
            
            {/* Send Button */}
            <button
              type="submit"
              className={`
                flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent
                ${inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500' 
                  : 'bg-theme-bg-tertiary text-theme-text-muted cursor-not-allowed'
                }
              `}
              disabled={!inputValue.trim() || isLoading}
              aria-label={isLoading ? "កំពុងផ្ញើសារ..." : "ផ្ញើសារ"}
              title={isLoading ? "កំពុងផ្ញើសារ..." : "ផ្ញើសារ (Enter)"}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ChatInput;