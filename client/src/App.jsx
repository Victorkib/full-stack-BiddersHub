import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, RequireAuth } from './routes/layout/layout';
import HomePage from './routes/homePage/homePage';
import ListPage from './routes/listPage/listPage';
import SinglePage from './routes/singlePage/singlePage';
import ProfilePage from './routes/profilePage/profilePage';
import Login from './routes/login/login';
import Register from './routes/register/register';
import ProfileUpdatePage from './routes/profileUpdatePage/profileUpdatePage';
import NewPostPage from './routes/newPostPage/newPostPage';
import DashboardPage from './routes/dashboard/DashboardPage';
import SessionForm from './routes/session/SessionForm';
import Deve from './components/underDeve/Deve';
import NotFoundPage from './components/underDeve/NotFound';
import EmailSent from './routes/EmailSent/EmailSent';
import ResetPassword from './routes/ResetPassword/ResetPassword';
import EditSingle from './routes/Edit/EditSingle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="list" element={<ListPage />} />
          <Route path=":id" element={<SinglePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="emailSent" element={<EmailSent />} />
          <Route path="resetPassword" element={<ResetPassword />} />
          <Route path="forgotPassword" element={<Deve />} />
        </Route>
        <Route path="/" element={<RequireAuth />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/update" element={<ProfileUpdatePage />} />
          <Route path="add" element={<NewPostPage />} />
          <Route path="edit/:id" element={<EditSingle />} />
          <Route path="liveAuctions" element={<DashboardPage />} />
          <Route path="liveAuctions/create" element={<SessionForm />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
