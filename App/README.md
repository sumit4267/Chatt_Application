# Thread — Real-Time 1-on-1 Chat Application

Thread is a full-stack real-time chat application that allows users to securely communicate with each other through one-on-one messaging.

The application is built using the **MERN stack** with **Socket.IO** for real-time communication. It includes user authentication, protected routes, online user status, typing indicators, and persistent chat history.

## 🚀 Features

* User registration and login
* Secure password hashing using **bcrypt**
* JWT-based authentication
* Authentication using **httpOnly cookies**
* Protected frontend and backend routes
* Real-time one-on-one messaging using **Socket.IO**
* Online and offline user status
* Typing indicators
* Persistent message history using **MongoDB**
* Automatic loading of previous conversations
* Optimistic message updates for a faster user experience
* User logout functionality

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JSON Web Token (JWT)
* bcrypt

## 📁 Project Structure

```text
chat-app/
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── messageController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   │
│   ├── routes/
│   ├── utils/
│   │   └── generateToken.js
│   └── server.js
│
└── client/
    └── src/
        ├── api/
        ├── context/
        ├── components/
        └── pages/
```

## ⚙️ Installation and Setup

### Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file and add the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

### Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file if required:

```env
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend application:

```bash
npm run dev
```

The application will run on:

```text
http://localhost:5173
```

## 🔐 Authentication Flow

The application uses JWT-based authentication with httpOnly cookies.

1. A user registers or logs into the application.
2. The password is securely hashed or verified using bcrypt.
3. The server generates a JWT containing the authenticated user's information.
4. The JWT is stored in an httpOnly cookie.
5. Protected API routes verify the JWT before allowing access.
6. The authenticated user information is attached to the request.
7. Socket connections are authenticated before users can exchange real-time messages.

Using httpOnly cookies prevents client-side JavaScript from directly accessing the authentication token.

## 💬 Real-Time Messaging

Socket.IO is used to establish real-time communication between users.

When a user sends a message:

1. The message is sent to the server.
2. The message is stored in MongoDB.
3. The server identifies the receiving user.
4. If the receiver is online, the message is delivered instantly through Socket.IO.
5. Previous messages can be retrieved from MongoDB when opening a conversation.

The application also manages user connection status and typing events to improve the chat experience.

## 🗄️ Database

MongoDB is used to store:

* User information
* Hashed passwords
* Messages
* Sender and receiver details
* Message timestamps

Mongoose is used to define schemas and interact with the MongoDB database.

## 🌐 Deployment

For production deployment:

* Use MongoDB Atlas or another managed MongoDB service.
* Configure production environment variables.
* Update `CLIENT_URL` with the deployed frontend URL.
* Update `VITE_SOCKET_URL` with the deployed backend URL.
* Use HTTPS when working with secure authentication cookies.

## 📌 What I Learned

While building this project, I gained practical experience with:

* Building REST APIs with Express.js
* MongoDB and Mongoose database operations
* JWT authentication and protected routes
* Password hashing using bcrypt
* Cookie-based authentication
* Real-time communication using Socket.IO
* React Context for managing application state
* Connecting a React frontend with a Node.js backend
* Managing user authentication and real-time events
