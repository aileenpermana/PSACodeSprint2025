import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import SignInAltPage from './components/SignInAltPage';
import ResetPasswordPage from './components/ResetPasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin-alt" replace />} />
        <Route path="/signin-alt" element={<SignInAltPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/signin-alt" replace />} />
      </Routes>
    </Router>
  );
}

export default App;