import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { authAPI } from '@/services/api';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Check for existing authentication on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI ChatBot
            </h1>
            <p className="text-gray-300">Your intelligent conversation companion</p>
          </div>
          
          {authMode === 'login' ? (
            <LoginForm onAuth={handleAuth} onSwitchMode={() => setAuthMode('signup')} />
          ) : (
            <SignupForm onAuth={handleAuth} onSwitchMode={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  return <ChatInterface onLogout={handleLogout} />;
};

export default Index;
