
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PlusCircle, 
  MessageSquare, 
  LogOut, 
  X,
  Menu
} from 'lucide-react';
import { ChatHistory } from './ChatInterface';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  isMobile: boolean;
}

export const ChatSidebar = ({
  isOpen,
  onToggle,
  chatHistory,
  currentChatId,
  onSelectChat,
  onNewChat,
  onLogout,
  isMobile,
}: ChatSidebarProps) => {
  if (!isOpen && isMobile) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}
      
      <div className={`
        ${isMobile ? 'fixed left-0 top-0 z-50' : 'relative'}
        w-80 h-full bg-gray-800 border-r border-gray-700 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">AI ChatBot</h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <Button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  ${currentChatId === chat.id 
                    ? 'bg-purple-600/20 border border-purple-500/30 text-white' 
                    : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.lastMessage.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};
