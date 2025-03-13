import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TransactionPage from './pages/TransactionPage';
import NotFound from './pages/NotFoundPage';
import Header from './components/ui/Header';
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query.js';

function App() {
  const { data } = useQuery(GET_AUTHENTICATED_USER);
  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path="/" element={data?.authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={data?.authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={data?.authUser ? <Navigate to="/" /> : <SignupPage />} />
        <Route path="/transaction/:id" element={data?.authUser ? <TransactionPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
