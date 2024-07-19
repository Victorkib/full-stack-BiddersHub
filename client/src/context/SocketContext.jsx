import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  const socketUrl = 'http://localhost:4000';
  // const socketUrl = 'https://bidderssocket.onrender.com';

  useEffect(() => {
    setSocket(io(socketUrl));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit('newUser', currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
