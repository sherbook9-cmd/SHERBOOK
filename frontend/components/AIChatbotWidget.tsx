'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';

import { API_BASE_URL } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedBooks?: any[];
}

interface AIChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbotWidget: React.FC<AIChatbotWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Assalam-o-Alaikum! I'm SherBot, your AI Shopping Assistant at SherBook.com. How can I help you find books, answer queries, or guide your checkout today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          suggestedBooks: data.suggested_books
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Here are recommendations for '${userMessage.content}': We deliver across Pakistan via Easypaisa, JazzCash, and Cash on Delivery with free shipping on orders over Rs. 2,000!`
        }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'd love to help you find books! Try searching for categories like Artificial Intelligence, Self-Help, Business, or Fiction.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md glass-panel rounded-3xl border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              SherBot AI Assistant <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h3>
            <span className="text-[10px] text-sky-100">Online • Pakistan's Smart Bookstore AI</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <p>{msg.content}</p>
              
              {/* Suggested books if present */}
              {msg.suggestedBooks && msg.suggestedBooks.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-sky-400">Suggested Books:</span>
                  {msg.suggestedBooks.map((b: any, bIdx: number) => (
                    <div key={bIdx} className="p-2 bg-slate-950/80 rounded-lg flex items-center justify-between text-[11px]">
                      <span className="font-medium text-white truncate max-w-[150px]">{b.title}</span>
                      <span className="text-amber-400 font-bold">Rs. {b.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>SherBot AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-slate-900/90 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleQuickQuestion("What payment methods do you support in Pakistan?")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 whitespace-nowrap flex items-center gap-1"
        >
          <CreditCard className="w-3 h-3 text-sky-400" /> Payments
        </button>
        <button
          onClick={() => handleQuickQuestion("Recommend top books on Artificial Intelligence")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 whitespace-nowrap flex items-center gap-1"
        >
          <BookOpen className="w-3 h-3 text-amber-400" /> AI Books
        </button>
        <button
          onClick={() => handleQuickQuestion("How does free shipping work in Pakistan?")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 whitespace-nowrap flex items-center gap-1"
        >
          <ShoppingBag className="w-3 h-3 text-emerald-400" /> Delivery
        </button>
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask SherBot anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
