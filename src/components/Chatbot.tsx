import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { cn } from '../lib/utils';
import chatbotKnowledge from '../data/chatbot_knowledge.json';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! I am your PSHM-DSS Awareness Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length > 1) {
        try {
          const res = await axios.get(`/api/chatbot/suggestions?q=${input}`);
          setDynamicSuggestions(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setDynamicSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setDynamicSuggestions([]);
    setLoading(true);

    try {
      const response = await axios.post('/api/chatbot/query', { message: text });
      const botMsg: Message = { role: 'bot', content: response.data.answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const defaultSuggestions = chatbotKnowledge.categories.flatMap(c => c.questions).slice(0, 8);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gov-navy text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Bot className="w-6 h-6 text-gov-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-base">PSHM-DSS Assistant</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Offline Awareness Support</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gov-bg/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'user' ? "bg-gov-blue text-white" : "bg-white text-gov-navy border border-gov-border"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm max-w-[85%] shadow-sm leading-relaxed",
                    msg.role === 'user' ? "bg-gov-blue text-white rounded-tr-none" : "bg-white text-gov-text-dark border border-gov-border rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-gov-navy border border-gov-border flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gov-border shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-200 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Area */}
            <div className="bg-white border-t border-gov-border">
              {/* Dynamic Suggestions while typing */}
              <AnimatePresence>
                {dynamicSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-3 bg-gov-bg space-y-1 border-b border-gov-border"
                  >
                    <p className="text-[10px] font-bold text-gov-text-muted uppercase tracking-wider px-2 mb-1">Matching Questions</p>
                    {dynamicSuggestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="w-full text-left text-xs text-gov-text-dark hover:bg-white hover:text-gov-blue p-2 rounded-lg transition-all flex items-center gap-2 group"
                      >
                        <ChevronRight className="w-3 h-3 text-gov-text-muted group-hover:text-gov-blue" />
                        {q}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Persistent Default Suggestions */}
              <div className="p-4">
                <p className="text-[10px] font-bold text-gov-text-muted uppercase tracking-wider mb-2">Recommended Awareness Prompts</p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                  {defaultSuggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-[11px] bg-gov-bg hover:bg-slate-100 text-gov-text-dark px-3 py-2 rounded-xl border border-gov-border transition-all text-left hover:border-gov-blue/30 hover:shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-5 bg-white border-t border-gov-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about social media laws..."
                  className="input-field flex-1"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-12 h-12 flex items-center justify-center bg-gov-navy text-white rounded-xl hover:bg-gov-slate transition-all disabled:opacity-50 shadow-lg shadow-gov-navy/10"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
          isOpen ? "bg-white text-gov-navy border border-gov-border" : "bg-gov-navy text-white"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
