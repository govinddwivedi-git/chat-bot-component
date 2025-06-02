# ChatBot AI - Intelligent Conversation Platform

A modern, responsive web application that provides an intelligent chatbot interface built with React and featuring a beautiful dark theme UI.

## Features

### 🤖 AI Chat Interface
- Real-time conversation with AI
- Message history persistence
- Typing indicators and smooth animations
- Auto-scrolling chat interface

### 🔐 User Authentication
- User registration and login
- Protected routes for authenticated users
- Persistent login sessions
- User profile management

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark theme with gradient accents
- Smooth animations and transitions
- Tailwind CSS for styling

### 📱 Core Pages
- **Home**: Landing page with hero section and features
- **Chat**: Main chat interface with AI
- **History**: View past conversations
- **Profile**: Manage user account information
- **Settings**: Customize app preferences
- **About**: Information about the platform

### ⚙️ Additional Features
- Local storage for data persistence
- Error boundary for graceful error handling
- Loading states and spinners
- Customizable settings (theme, notifications, etc.)

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: Local Storage
- **Build Tool**: Create React App

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   cd "c:\Users\HP\Desktop\New folder"
   ```

2. **Navigate to client directory**
   ```bash
   cd client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
client/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Chat.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── History.jsx
│   │   ├── About.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Usage

### Authentication
1. Visit the home page
2. Click "Sign Up" to create a new account
3. Or "Sign In" if you already have an account
4. Fill in your credentials and submit

### Chat Interface
1. After logging in, navigate to the Chat page
2. Type your message in the input field
3. Press Enter or click Send
4. The AI will respond with simulated intelligent responses
5. All conversations are automatically saved

### Settings & Customization
1. Go to Settings from the user menu
2. Customize appearance, notifications, and preferences
3. Clear chat history or reset settings as needed

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Features in Detail

### Authentication System
- Uses React Context for state management
- Stores user data in localStorage
- Automatic login persistence
- Protected routes for authenticated users

### Chat Functionality
- Simulated AI responses with realistic delays
- Message persistence using localStorage
- Real-time typing indicators
- Smooth auto-scrolling to new messages

### Responsive Design
- Mobile-first approach
- Works on desktop, tablet, and mobile
- Adaptive navigation and layouts
- Touch-friendly interface

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Real AI integration (OpenAI, Claude, etc.)
- Voice chat capabilities
- File upload and sharing
- Real-time notifications
- Multi-language support
- Database integration
- User avatars and profiles
- Chat rooms and group conversations

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React and Tailwind CSS
