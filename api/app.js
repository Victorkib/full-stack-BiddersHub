// app.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { upload } from './middleware/upload.js'; // Import Multer middleware

// Route Imports
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import messageRoute from './routes/message.route.js';
import sessionRoutes from './routes/session.js';

const app = express();
const port = process.env.PORT || 8800;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Use Multer middleware
app.use(upload);

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/test', testRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);
app.use('/api/sessions', sessionRoutes);

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
