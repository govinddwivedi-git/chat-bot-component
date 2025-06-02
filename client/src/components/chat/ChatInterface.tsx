import { useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { useIsMobile } from '@/hooks/use-mobile';
import { chatAPI } from '@/services/api';

interface ChatInterfaceProps {
  onLogout: () => void;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: Date;
}

export const ChatInterface = ({ onLogout }: ChatInterfaceProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'AI Conversation',
      messages: [
        {
          id: '1',
          content: 'Hello! How can I help you today? You can ask me questions or share an image for analysis.',
          sender: 'bot',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
      ],
      lastMessage: new Date(Date.now() - 1000 * 60 * 30),
    },
  ]);
  const isMobile = useIsMobile();

  const handleNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [
        {
          id: 'welcome-' + Date.now(),
          content: 'Hello! How can I help you today? You can ask me questions or share an image for analysis.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      lastMessage: new Date(),
    };
    setChatHistory([newChat, ...chatHistory]);
    setCurrentChatId(newChat.id);
  };

  const handleSendMessage = async (content: string, imageFile?: File) => {
    if (!currentChatId) {
      handleNewChat();
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      image: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    // Add user message immediately
    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              lastMessage: new Date(),
              title: chat.messages.length <= 1 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : chat.title,
            }
          : chat
      )
    );

    try {
      // Send to API
      const response = await chatAPI.sendMessage(content, imageFile);
      
      // Create bot response message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add bot message
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, botMessage],
                lastMessage: new Date(),
              }
            : chat
        )
      );
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
                lastMessage: new Date(),
              }
            : chat
        )
      );
    }
  };

  const currentChat = chatHistory.find(chat => chat.id === currentChatId);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onLogout={onLogout}
        isMobile={isMobile}
      />

      {/* Chat Area */}
      <ChatArea
        currentChat={currentChat}
        onSendMessage={handleSendMessage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};
