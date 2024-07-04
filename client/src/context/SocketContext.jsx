import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Update the URL to point to your hosted socket server
    setSocket(
      io('https://bidderssocket.onrender.com', {
        withCredentials: true, // Ensure credentials are sent with the request
      })
    );
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      socket.emit('newUser', currentUser.id);
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
