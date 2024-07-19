import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import BidderLogin from './Routes/Bidders/BiddersAuth/bidderLogin/BidderLogin';
import BidderRegister from './Routes/Bidders/BiddersAuth/bidderRegister/BidderRegister';
// import BiddersLandingPage from './Routes/Bidders/bidderLandingPage/BidderLandingPage';
import BidderProfile from './Routes/Bidders/BidderProfile/BidderProfile';
import SessionListPage from './components/SessionData/SessionListPage/SessionListPage';
import SessionDetailPage from './components/SessionData/SessionDetailPage/SessionDetailPage';
import PostDetailPage from './components/SessionData/PostDetailPage/PostDetailPage';
import SessionEndPage from './components/SessionData/SessionEndPage/SessionEndPage';

import { Layout, RequireAuth } from './Routes/layout/layout';

import NotFoundPage from './components/underDeve/NotFound';
import Wins from './components/SessionData/wins/Wins';
import ResultNotifications from './components/SessionData/resultOfSession/ResultOfSession';
import Participation from './components/SessionData/participations/Participation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<NotFoundPage />} />
          {/* <Route path="/" element={<BiddersLandingPage />} /> */}
          <Route path="/login" element={<BidderLogin />} />
          <Route path="/register" element={<BidderRegister />} />
        </Route>
        <Route path="/" element={<RequireAuth />}>
          <Route path="/bidderProfile" element={<BidderProfile />} />
          <Route path="/usersSession" element={<SessionListPage />} />
          <Route path="/sessions/:id" element={<SessionDetailPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/session-end/:id" element={<SessionEndPage />} />
          <Route
            path="/resultNotifications"
            element={<ResultNotifications />}
          />
          <Route path="/wins" element={<Wins />} />
          <Route path="/participation" element={<Participation />} />
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
