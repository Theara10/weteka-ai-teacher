"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Copy, Share2, Edit, Bold, Italic, Underline, List } from "lucide-react";
import { ChatMessage as ChatMessageType } from "../types";
import DOMPurify from 'isomorphic-dompurify';

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
  isEditing: boolean;
  editedContent: string;
  onStartEditing: (index: number, content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onContentChange: (value: string) => void;
  onCopy: (content: string) => void;
  onShare: (content: string) => void;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  index,
  isEditing,
  editedContent,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onContentChange,
  onCopy,
  onShare,
}) => {

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 sm:space-x-3 w-full ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {message.role === "user" ? (
            <div className="w-8 h-8 bg-theme-text-muted rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="white"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Image
                src="/weteka-logo.png"
                width={20}
                height={20}
                alt="weteka-logo"
                className="w-5 h-5 invert"
              />
            </div>
          )}
        </div>
        
        {/* Message Content */}
        <div className="flex flex-col space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <div className="text-xs font-semibold text-theme-text-muted bg-theme-bg-secondary px-2 py-1 rounded-full">
              {message.role === "user" ? "You" : "Weteka AI"}
            </div>
          </div>
          
          {/* Check if this message is being edited */}
          {isEditing ? (
            <div className="bg-theme-bg border border-theme-border rounded-2xl p-4 shadow-sm">
              <div className="mb-3">
                <div className="border border-theme-border rounded-lg overflow-hidden">
                  <div className="bg-theme-bg-secondary px-3 py-2 border-b border-theme-border">
                    <div className="flex items-center space-x-2 text-sm text-theme-text-secondary">
                      <button 
                        type="button"
                        className="hover:bg-theme-bg-tertiary px-1.5 py-1 rounded transition-colors"
                        onClick={() => {
                          const selection = window.getSelection();
                          if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const bold = document.createElement('strong');
                            try {
                              range.surroundContents(bold);
                              const target = bold.closest('[contenteditable]') as HTMLElement;
                              if (target) onContentChange(target.innerHTML || "");
                            } catch {
                              // Fallback for complex selections
                              const text = selection.toString();
                              range.deleteContents();
                              bold.textContent = text;
                              range.insertNode(bold);
                              const target = bold.closest('[contenteditable]') as HTMLElement;
                              if (target) onContentChange(target.innerHTML || "");
                            }
                          }
                        }}
                        title="Bold"
                        aria-label="Make text bold"
                      >
                        <Bold className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        type="button"
                        className="hover:bg-theme-bg-tertiary px-1.5 py-1 rounded transition-colors"
                        onClick={() => {
                          const selection = window.getSelection();
                          if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const italic = document.createElement('em');
                            try {
                              range.surroundContents(italic);
                              const target = italic.closest('[contenteditable]') as HTMLElement;
                              if (target) onContentChange(target.innerHTML || "");
                            } catch {
                              const text = selection.toString();
                              range.deleteContents();
                              italic.textContent = text;
                              range.insertNode(italic);
                              const target = italic.closest('[contenteditable]') as HTMLElement;
                              if (target) onContentChange(target.innerHTML || "");
                            }
                          }
                        }}
                        title="Italic"
                        aria-label="Make text italic"
                      >
                        <Italic className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        type="button"
                        className="hover:bg-theme-bg-tertiary px-1.5 py-1 rounded transition-colors"
                        onClick={() => {
                          const selection = window.getSelection();
                          if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const underline = document.createElement('u');
                            try {
                              range.surroundContents(underline);
                              const target = underline.closest('[contenteditable]') as HTMLElement;
                              if (target) onContentChange(target.innerHTML || "");
                            } catch {
                              const text = selection.toString();
                              range.deleteContents();
                              underline.textContent = text;
                              range.insertNode(underline);
                              const target = underline.closest('[contenteditable]') as HTMLElement;
                              if (target) onContentChange(target.innerHTML || "");
                            }
                          }
                        }}
                        title="Underline"
                        aria-label="Underline text"
                      >
                        <Underline className="h-3.5 w-3.5" />
                      </button>
                      <div className="w-px h-4 bg-theme-border mx-1"></div>
                      <button 
                        type="button"
                        className="hover:bg-theme-bg-tertiary px-1.5 py-1 rounded transition-colors text-xs"
                        onClick={() => {
                          const selection = window.getSelection();
                          const editable = document.activeElement as HTMLElement;
                          if (editable && editable.contentEditable === 'true') {
                            const ul = document.createElement('ul');
                            const li = document.createElement('li');
                            li.textContent = selection?.toString() || 'List item';
                            ul.appendChild(li);
                            
                            if (selection && selection.rangeCount > 0) {
                              const range = selection.getRangeAt(0);
                              range.deleteContents();
                              range.insertNode(ul);
                            } else {
                              editable.appendChild(ul);
                            }
                            onContentChange(editable.innerHTML || "");
                          }
                        }}
                        title="Bullet List"
                        aria-label="Create bullet list"
                      >
                        <List className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div
                    contentEditable
                    className="p-4 min-h-[120px] max-h-[300px] overflow-y-auto outline-none text-sm leading-relaxed bg-theme-bg text-theme-text focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    style={{ whiteSpace: 'pre-wrap' }}
                    suppressContentEditableWarning={true}
                    role="textbox"
                    aria-label="Edit message content"
                    aria-multiline="true"
                    onInput={(e) => {
                      const target = e.target as HTMLElement;
                      onContentChange(target.innerHTML || "");
                    }}
                    onBlur={(e) => {
                      const target = e.target as HTMLElement;
                      onContentChange(target.innerHTML || "");
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(
                        editedContent.replace(/\n/g, '<br>'),
                        {
                          ALLOWED_TAGS: ['br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'p'],
                          ALLOWED_ATTR: []
                        }
                      )
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-2 text-sm bg-theme-bg-secondary text-theme-text-secondary rounded-lg hover:bg-theme-bg-tertiary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Cancel editing"
                  aria-label="Cancel editing"
                >
                  ✕
                </button>
                <button
                  onClick={onSaveEdit}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Save changes"
                  aria-label="Save changes"
                >
                  ✓
                </button>
              </div>
            </div>
          ) : (
            <div className={`
              group relative border border-theme-border p-4 rounded-2xl transition-all duration-200 hover:shadow-md
              ${message.role === 'user' 
                ? 'bg-theme-accent text-white ml-8' 
                : 'bg-theme-bg text-theme-text mr-8'
              }
            `}>
              {/* Message Content */}
              <div 
                className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(
                    message.content.replace(/\n/g, '<br>'),
                    {
                      ALLOWED_TAGS: ['br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'p', 'a'],
                      ALLOWED_ATTR: ['href', 'target'],
                      ALLOWED_URI_REGEXP: /^https?:\/\//
                    }
                  )
                }}
              />
              
              {/* Action Buttons - Only show for AI messages */}
              {message.role === 'assistant' && (
                <div className="flex items-center justify-end space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => onCopy(message.content)}
                    className="bg-theme-bg-secondary hover:bg-blue-50 dark:hover:bg-blue-900/20 text-theme-text-secondary hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg border border-theme-border hover:border-blue-200 dark:hover:border-blue-800 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Copy message"
                    aria-label="Copy message to clipboard"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onStartEditing(index, message.content)}
                    className="bg-theme-bg-secondary hover:bg-purple-50 dark:hover:bg-purple-900/20 text-theme-text-secondary hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded-lg border border-theme-border hover:border-purple-200 dark:hover:border-purple-800 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Edit message"
                    aria-label="Edit this message"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onShare(message.content)}
                    className="bg-theme-bg-secondary hover:bg-green-50 dark:hover:bg-green-900/20 text-theme-text-secondary hover:text-green-600 dark:hover:text-green-400 p-2 rounded-lg border border-theme-border hover:border-green-200 dark:hover:border-green-800 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Share to Telegram"
                    aria-label="Share message to Telegram"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;