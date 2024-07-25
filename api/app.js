import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url'; // Import the fileURLToPath function from the url module
import { upload } from './middleware/upload.js'; // Import Multer middleware

// Route Imports
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import messageRoute from './routes/message.route.js';
import sessionRoutes from './routes/session.js';
import biddersRoute from './routes/bidder.route.js';
import walletRoute from './routes/wallet.routes.js';
import paypalRoutes from './routes/paypal.routes.js';

const app = express();
const port = process.env.PORT || 8800;

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.BIDDER_URL],
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Use Multer middleware
app.use(upload);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const auctioneerStaticPath = path.join(__dirname, '..', 'client', 'dist');
const auctioneerIndexPath = path.join(auctioneerStaticPath, 'index.html');
const bidderStaticPath = path.join(__dirname, '..', 'bidderClient', 'dist');
const bidderIndexPath = path.join(bidderStaticPath, 'index.html');

console.log('auctioneerStaticPath: ', auctioneerStaticPath);
console.log('auctioneerIndexPath: ', auctioneerIndexPath);
console.log('bidderStaticPath: ', bidderStaticPath);
console.log('bidderIndexPath: ', bidderIndexPath);

// Routes setup
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/test', testRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);
app.use('/api/sessions', sessionRoutes);
app.use('/api/bidders', biddersRoute);
app.use('/api/wallet', walletRoute);
app.use('/api/paypal', paypalRoutes);

// Serve static files
app.use(express.static(auctioneerStaticPath));
app.use(express.static(bidderStaticPath));

// Catch-all route to serve index.html for each frontend based on the host
app.get('*', (req, res) => {
  const host = req.headers.host;
  if (host.includes('bidderspagefront.onrender.com')) {
    res.sendFile(bidderIndexPath);
  } else if (host.includes('bidders-hub.onrender.com')) {
    res.sendFile(auctioneerIndexPath);
  } else {
    res.status(404).send('Not Found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
