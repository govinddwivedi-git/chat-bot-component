# AI ChatBot Component - Full-Stack Intelligent Conversation Platform

A modern, full-stack chatbot application built with React (TypeScript) frontend and Node.js backend, designed to be easily integrated into future projects as a reusable component.

## 🚀 Features

### 🤖 AI Chat Interface
- Real-time conversation with AI powered by **Google Gemini 2.0 Flash**
- Image upload and analysis capabilities
- Message history persistence with MongoDB
- Modern chat UI with typing indicators
- Auto-scrolling and responsive design

### 🔐 Authentication System
- JWT-based authentication with access/refresh tokens
- User registration and login
- Protected routes and automatic token refresh
- Secure cookie-based session management

### 🎨 Modern UI/UX
- **shadcn/ui** component library with Tailwind CSS
- Dark theme with gradient accents
- Fully responsive design (mobile-first)
- Smooth animations and transitions
- Chat sidebar with conversation history

### 💾 Database Integration
- MongoDB for user data and chat history
- Cloudinary for image storage
- Full CRUD operations for chat management
- Persistent conversation threads

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Gemini AI** for chat responses
- **Cloudinary** for image storage
- **Multer** for file uploads
- **bcrypt** for password hashing

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **shadcn/ui** + **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Axios** for API communication
- **TanStack Query** for state management

## 📁 Project Structure

```
\New folder\
├── server/                          # Backend API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js   # Auth & user management
│   │   │   └── chat.controller.js   # Chat & AI logic
│   │   ├── models/
│   │   │   ├── user.model.js        # User schema
│   │   │   └── chat.model.js        # Chat schema
│   │   ├── routes/
│   │   │   └── user.route.js        # API routes
│   │   ├── utils/                   # Utility functions
│   │   ├── db/                      # Database connection
│   │   ├── app.js                   # Express app setup
│   │   └── index.js                 # Server entry point
│   └── package.json
├── client/                          # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # Login/Signup forms
│   │   │   ├── chat/                # Chat interface components
│   │   │   └── ui/                  # shadcn/ui components
│   │   ├── pages/
│   │   │   └── Index.tsx            # Main app page
│   │   ├── services/
│   │   │   └── api.ts               # API client & auth
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── utils/                   # Utility functions
│   │   ├── App.tsx                  # App component
│   │   └── main.tsx                 # Entry point
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Environment Setup

1. **Clone and navigate to the project**
   ```bash
   cd "New folder"
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

   Create `.env` file in server directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/chatbot
   CORS_ORIGIN=http://localhost:8080
   
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRY=7d
   
   GOOGLE_API_KEY=your_google_gemini_api_key
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

4. **Start Development Servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```

5. **Access the Application**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:8000`

## 🔧 Configuration

### Required API Keys
- **Google Gemini API**: Get from [Google AI Studio](https://makersuite.google.com/)
- **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/)
- **MongoDB**: Use local MongoDB or [MongoDB Atlas](https://www.mongodb.com/atlas)

### Authentication Secrets
Generate secure random strings for JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🔌 Using as a Component

This chatbot is designed to be easily integrated into other projects:

### 1. Copy Core Components
```bash
# Copy these essential files to your project:
client/src/components/chat/
client/src/services/api.ts
server/src/controllers/chat.controller.js
server/src/models/chat.model.js
```

### 2. Install Dependencies
```bash
# Backend
npm install @google/genai mongoose multer cloudinary

# Frontend  
npm install axios @radix-ui/react-* lucide-react
```

### 3. Integration Example
```tsx
import { ChatInterface } from './components/chat/ChatInterface';

function App() {
  return (
    <div className="app">
      <ChatInterface onLogout={() => {}} />
    </div>
  );
}
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/validate-token` - Validate token

### Chat
- `POST /api/v1/users/chat` - Send message to AI
- `GET /api/v1/users/chat-history` - Get chat history

## 🎯 Key Features for Reusability

### Modular Architecture
- Separated authentication and chat logic
- Reusable UI components with shadcn/ui
- TypeScript for better development experience
- Clean API structure

### Customizable
- Easy theme customization with Tailwind CSS
- Configurable AI model (currently Gemini)
- Flexible database schema
- Environment-based configuration

### Production Ready
- JWT security with refresh tokens
- Error handling and validation
- File upload with cloud storage
- Responsive design

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for security
- CORS configuration
- Input validation and sanitization

## 🚀 Production Deployment

### Backend
1. Set up MongoDB Atlas or production database
2. Configure environment variables
3. Deploy to services like Railway, Render, or DigitalOcean

### Frontend
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update API endpoints for production

## 🤝 Contributing

This project is designed to be extended and customized:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - Feel free to use in your projects!

## 🔮 Future Enhancements

- Multi-model AI support (OpenAI, Claude, etc.)
- Voice chat capabilities
- Real-time collaboration
- Plugin system for extensions
- Advanced conversation analytics
- Multi-language support

---

**Perfect for integration into any project requiring intelligent chat capabilities!**

Built with ❤️ for developers who need a robust, ready-to-use chatbot component.
