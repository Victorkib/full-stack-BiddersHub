import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './index.scss';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { SocketContextProvider } from './context/SocketContext.jsx';

import { Provider } from 'react-redux';
import store from './app/store.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <Provider store={store}>
          {' '}
          <App />
        </Provider>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
