import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  ImagePlus, 
  Menu,
  Bot,
  User,
  X
} from 'lucide-react';
import { ChatHistory, Message } from './ChatInterface';
import { MarkdownMessage } from './MarkdownMessage';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDateTime, formatDate } from '@/utils/dateUtils';

interface UserInfo {
  _id: string;
  fullName: string;
  email: string;
}

interface ChatAreaProps {
  currentChat?: ChatHistory;
  onSendMessage: (content: string, image?: File) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userInfo: UserInfo | null;
}

export const ChatArea = ({ 
  currentChat, 
  onSendMessage, 
  sidebarOpen, 
  onToggleSidebar,
  userInfo 
}: ChatAreaProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!message.trim() && !selectedImage) return;

    setIsLoading(true);
    
    try {
      await onSendMessage(message || 'Please analyze this image', selectedImage || undefined);
      setMessage('');
      setSelectedImage(null);
      setImagePreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          {(!sidebarOpen || isMobile) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">AI Assistant</h3>
              <p className="text-xs text-gray-400">Always here to help</p>
            </div>
          </div>
          {userInfo && (
            <div className="ml-auto flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm text-white">{userInfo.fullName}</p>
                <p className="text-xs text-gray-400">{formatDate(new Date())}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {currentChat?.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-400">
                Ask me anything or share an image to get started
              </p>
            </div>
          ) : (
            currentChat?.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} userInfo={userInfo} />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-2xl rounded-bl-md p-4 max-w-xs lg:max-w-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Upload preview" 
                className="max-w-xs max-h-32 rounded-lg object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={selectedImage ? "Ask about this image..." : "Type your message..."}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 pr-12"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-1 top-1 text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && !selectedImage) || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  userInfo: UserInfo | null;
}

const MessageBubble = ({ message, userInfo }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';
  const senderName = isUser ? (userInfo?.fullName || 'You') : 'AI Assistant';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-2xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
        
        <div className={`rounded-2xl p-4 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-md' 
            : 'bg-gray-700 text-white rounded-bl-md'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-xs font-medium ${isUser ? 'text-blue-100' : 'text-gray-300'}`}>
              {senderName}
            </p>
            <p className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
              {formatDateTime(message.timestamp)}
            </p>
          </div>
          {message.image && (
            <img 
              src={message.image} 
              alt="Shared image" 
              className="rounded-lg mb-2 max-w-full h-auto"
            />
          )}
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownMessage content={message.content} className="text-sm" />
          )}
        </div>
      </div>
    </div>
  );
};
