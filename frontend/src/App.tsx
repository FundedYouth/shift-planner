import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from 'pages/Login';
import Team from 'pages/Team';
import Schedule from 'pages/Schedule';
import Profile from 'pages/Profile';
import MainLayout from "./components/layouts/MainLayout";
import { LoginProvider } from 'context/LoginContext';
import ProtectedRoute from 'components/ProtectedRoute';

function App() {
  return (
    <LoginProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/team" element={<Team />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LoginProvider>
  );
}

export default App
