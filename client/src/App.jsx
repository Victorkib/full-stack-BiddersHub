import HomePage from './routes/homePage/homePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ListPage from './routes/listPage/listPage';
import { Layout, RequireAuth } from './routes/layout/layout';
import SinglePage from './routes/singlePage/singlePage';
import ProfilePage from './routes/profilePage/profilePage';
import Login from './routes/login/login';
import Register from './routes/register/register';
import ProfileUpdatePage from './routes/profileUpdatePage/profileUpdatePage';
import NewPostPage from './routes/newPostPage/newPostPage';
import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from './lib/loaders';
import DashboardPage from './routes/dashboard/DashboardPage';
import Deve from './components/underDeve/Deve';
import NotFoundPage from './components/underDeve/NotFound';
import EmailSent from './routes/EmailSent/EmailSent';
import ResetPassword from './routes/ResetPassword/ResetPassword';
import EditSingle from './routes/Edit/EditSingle';
import SessionForm from './routes/session/SessionForm';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/list',
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: '/:id',
          element: <SinglePage />,
          loader: singlePageLoader,
        },

        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/register',
          element: <Register />,
        },
        {
          path: '/emailSent',
          element: <EmailSent />,
        },
        {
          path: '/resetPassword',
          element: <ResetPassword />,
        },
        {
          path: '/forgotPassword',
          element: <Deve />,
        },
      ],
    },
    {
      path: '/',
      element: <RequireAuth />,
      children: [
        {
          path: '/profile',
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: '/profile/update',
          element: <ProfileUpdatePage />,
        },
        {
          path: '/add',
          element: <NewPostPage />,
        },
        {
          path: '/edit/:id',
          element: <EditSingle />,
        },
        {
          path: '/liveAuctions',
          element: <DashboardPage />,
        },
        {
          path: '/liveAuctions/create',
          element: <SessionForm />,
        },
      ],
    },
    {
      path: '/*',
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
