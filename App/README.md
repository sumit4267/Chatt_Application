# Thread — Real-time 1-on-1 Chat App

A full-stack chat application built with **React (Vite)**, **Express**, **MongoDB**, and **Socket.IO**, using **JWT stored in an httpOnly cookie** for authentication.

> Note: this was built from scratch to a standard MERN + Socket.IO architecture. I can't watch or copy a specific YouTube video, so this isn't a frame-by-frame clone of any tutorial — it's a complete, working implementation of the same kind of app (auth, 1-on-1 real-time messaging).

## Features

- Register / login / logout with hashed passwords (bcrypt)
- Sessions via JWT in an httpOnly, secure cookie (not readable by JS — protects against XSS token theft)
- Route protection: unauthenticated users are redirected to `/login`, all API routes are guarded by middleware
- Real-time 1-on-1 messaging with Socket.IO
- Online/offline presence indicators
- "Is typing…" indicator
- Message history persisted in MongoDB, loaded per conversation
- Optimistic message sending (appears instantly, reconciled with the server response)

## Project structure

```
chat-app/
├─ server/            # Express API + Socket.IO
│  ├─ config/db.js
│  ├─ models/         # User, Message (Mongoose)
│  ├─ middleware/authMiddleware.js
│  ├─ controllers/    # authController, userController, messageController
│  ├─ routes/
│  ├─ utils/generateToken.js
│  └─ server.js
└─ client/            # React (Vite)
   └─ src/
      ├─ api/axios.js
      ├─ context/     # AuthContext, SocketContext
      ├─ components/  # Sidebar, ChatWindow, MessageBubble, MessageInput, ProtectedRoute
      └─ pages/       # Login, Register, ChatPage
```

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chat-app   # or your MongoDB Atlas URI
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run MongoDB locally, or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection string into `MONGO_URI`.

```bash
npm run dev
```

Server starts on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # VITE_SOCKET_URL=http://localhost:5000
npm run dev
```

App runs on `http://localhost:5173`. Vite proxies `/api` requests to the backend, and cookies are sent with `withCredentials: true`.

### 3. Try it out

Open two browser windows (or one normal + one incognito), register two different accounts, and message between them — messages arrive instantly via Socket.IO.

## How the auth works

1. `POST /api/auth/register` or `/login` hashes/checks the password and signs a JWT containing the user's ID.
2. The JWT is set as an `httpOnly` cookie — client-side JavaScript can never read it, which blocks token theft via XSS.
3. Every protected route runs through `middleware/authMiddleware.js`, which verifies the cookie and attaches `req.user`.
4. The Socket.IO server re-verifies the same cookie during the socket handshake (`io.use(...)` in `server.js`), so real-time events are also authenticated.
5. On the client, `AuthContext` calls `GET /api/auth/me` on load to restore the session, and `ProtectedRoute` redirects anyone without a valid session to `/login`.

## Deploying

- Set `NODE_ENV=production` on the server so cookies get `secure: true` and `sameSite: "none"` (required for cross-site cookies over HTTPS).
- Point `CLIENT_URL` (server) and `VITE_SOCKET_URL` (client) at your deployed URLs.
- Use a managed MongoDB (Atlas) rather than a local instance.
