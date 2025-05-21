
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatStore, Message, MessageType } from '../store/chatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import MainLayout from './MainLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] p-3 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 dark:text-white rounded-bl-none'
        }`}
      >
        <ReactMarkdown className="prose dark:prose-invert max-w-none">
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const { messages, addMessage, resetChat } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    
    // Add user message
    addMessage({ type: 'user', content: newMessage });
    setNewMessage('');
    
    // Simulate AI response after 1 second
    setTimeout(() => {
      addMessage({ type: 'ai', content: newMessage });
      setSending(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                {t('chat.emptyChat')}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>
        
        <div className="border-t p-4 bg-background">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              className="flex-1"
              disabled={sending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || sending}
              className={`transition-opacity ${sending ? 'opacity-50' : 'opacity-100'}`}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">{t('chat.send')}</span>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
