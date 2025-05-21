
import { create } from 'zustand';

export type MessageType = 'user' | 'ai';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => string;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  addMessage: (message) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id, timestamp: Date.now() },
      ],
    }));
    return id;
  },
  resetChat: () => set({ messages: [] }),
}));
