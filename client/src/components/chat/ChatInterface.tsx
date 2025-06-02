import { useState, useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { useIsMobile } from '@/hooks/use-mobile';
import { chatAPI, authAPI } from '@/services/api';
import { formatDate } from '@/utils/dateUtils';

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
  _id?: string; // MongoDB ID
}

export interface UserInfo {
  _id: string;
  fullName: string;
  email: string;
}

export const ChatInterface = ({ onLogout }: ChatInterfaceProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Load user info and chat history on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user info
        const userResponse = await authAPI.validateToken();
        console.log('User validated:', userResponse); // Debug log
        setUserInfo(userResponse.user);

        // Load chat history from backend
        try {
          console.log('Attempting to fetch chat history...'); // Debug log
          const historyResponse = await chatAPI.getChatHistory();
          console.log('Backend chat history raw response:', historyResponse); // Debug log
          
          if (!Array.isArray(historyResponse)) {
            console.error('Chat history response is not an array:', historyResponse);
            handleNewChat();
            return;
          }
          
          const backendChats = historyResponse
            .filter((chat: any) => {
              const isValid = chat && chat._id && chat.chat && chat.chat.question && chat.chat.answer;
              if (!isValid) {
                console.warn('Invalid chat filtered out:', chat);
              }
              return isValid;
            })
            .map((chat: any) => {
              // Extract question and answer safely
              const question = chat.chat.question;
              const answer = chat.chat.answer;
              const title = chat.title || (question.length > 30 ? question.slice(0, 30) + '...' : question);
              
              console.log('Processing chat:', { id: chat._id, title, question: question.slice(0, 50) }); // Debug log
              
              return {
                id: chat._id,
                _id: chat._id,
                title: title,
                messages: [
                  {
                    id: chat._id + '-question',
                    content: question,
                    sender: 'user' as const,
                    timestamp: new Date(chat.createdAt || Date.now()),
                    image: chat.imageUrl || undefined
                  },
                  {
                    id: chat._id + '-answer',
                    content: answer,
                    sender: 'bot' as const,
                    timestamp: new Date(chat.createdAt || Date.now())
                  }
                ],
                lastMessage: new Date(chat.updatedAt || chat.createdAt || Date.now())
              };
            });
          
          console.log('Processed chat history:', backendChats); // Debug log
          
          if (backendChats.length > 0) {
            setChatHistory(backendChats);
            setCurrentChatId(backendChats[0].id);
            console.log('Chat history loaded successfully, count:', backendChats.length);
          } else {
            console.log('No valid chats found, creating welcome chat');
            handleNewChat();
          }
        } catch (historyError) {
          console.error('Failed to load chat history:', historyError);
          handleNewChat();
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        onLogout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [onLogout]);

  const handleNewChat = () => {
    const newChat: ChatHistory = {
      id: 'new-' + Date.now().toString(),
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
        content: response.response || response.answer || response,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Update chat history with bot response and backend chat ID
      const newChatId = response.chatId || currentChatId;
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                id: newChatId,
                _id: response.chatId || chat._id,
                messages: [...chat.messages, botMessage],
                lastMessage: new Date(),
              }
            : chat
        )
      );

      // Update current chat ID if it was a new chat
      if (response.chatId && currentChatId !== response.chatId) {
        setCurrentChatId(response.chatId);
      }
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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
        userInfo={userInfo}
      />

      {/* Chat Area */}
      <ChatArea
        currentChat={currentChat}
        onSendMessage={handleSendMessage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userInfo={userInfo}
      />
    </div>
  );
};
