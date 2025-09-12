import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Auth from './pages/AuthPage';
import StudentHome from './pages/student/StudentHome';
import StudentAppointments from './pages/student/StudentAppointments';
import StudentEvents from './pages/student/StudentEvents';
import StudentPolls from './pages/student/StudentPolls';
import Directory from './pages/shared/Directory';
import Settings from './pages/shared/Settings';
import LecturerHome from './pages/lecturer/LecturerHome';
import LecturerAppointments from './pages/lecturer/LecturerAppointments';
import LecturerEvents from './pages/lecturer/LecturerEvents';
import LecturerMessages from './pages/lecturer/LecturerMessages';
import LecturerNotifications from './pages/lecturer/LecturerNotifications';
import LecturerFeedback from './pages/lecturer/LecturerFeedback';
import LecturerAnnouncements from './pages/lecturer/LecturerAnnouncements';
import AdminHome from './pages/admin/AdminHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminForums from './pages/admin/AdminForums';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminFeedbackFormManagement from './pages/admin/AdminFeedbackFormManagement';
import AdminPolls from './pages/admin/AdminPolls';
import AdminCommunityFeed from './pages/admin/AdminCommunityFeed';
import AdminCreateUser from './pages/admin/AdminCreateUser';
import AdminCreateEvent from './pages/admin/AdminCreateEvent';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import authService from './services/authService';
import NotFound from './pages/NotFound';

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getProfile();
          setUser(response.data || response);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        }
      } else if (window.location.pathname !== '/register') {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'lecturer') {
      navigate('/lecturer/dashboard');
    } else if (userData.role === 'admin' || userData.role === 'sys_admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Auth onAuthSuccess={handleAuthSuccess} route="#/login" />} />
        <Route path="/register" element={<Auth onAuthSuccess={handleAuthSuccess} route="#/register" />} />
        <Route path="*" element={<Navigate to="/login" replace />} /> {/* Redirects to login */}
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Student Routes */}
      {user.role === 'student' && (
        <>
          <Route path="/student/dashboard" element={<StudentHome />} />
          <Route path="/student/appointments" element={<StudentAppointments />} />
          <Route path="/student/events" element={<StudentEvents />} />
          <Route path="/student/polls" element={<StudentPolls />} />
        </>
      )}

      {/* Lecturer Routes */}
      {user.role === 'lecturer' && (
        <>
          <Route path="/lecturer/dashboard" element={<LecturerHome />} />
          <Route path="/lecturer/appointments" element={<LecturerAppointments />} />
          <Route path="/lecturer/events" element={<LecturerEvents />} />
          <Route path="/lecturer/messages" element={<LecturerMessages />} />
          <Route path="/lecturer/notifications" element={<LecturerNotifications />} />
          <Route path="/lecturer/feedback" element={<LecturerFeedback />} />
          <Route path="/lecturer/announcements" element={<LecturerAnnouncements />} />
        </>
      )}

      {/* Admin Routes */}
      {(user.role === 'admin' || user.role === 'sys_admin') && (
        <>
          <Route path="/admin/dashboard" element={<AdminHome />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/forums" element={<AdminForums />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/feedback-forms" element={<AdminFeedbackFormManagement />} />
          <Route path="/admin/polls" element={<AdminPolls />} />
          <Route path="/admin/community-feed" element={<AdminCommunityFeed />} />
          <Route path="/admin/users/create" element={<AdminCreateUser />} />
          <Route path="/admin/events/create" element={<AdminCreateEvent />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        </>
      )}

      {/* Shared Routes */}
      <Route path="/directory" element={<Directory />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/logout" element={<LogoutAction onLogout={handleLogout} />} />

      {/* Default redirect based on role or to 404 */}
      <Route
        path="*"
        element={user.role === 'lecturer' ? <LecturerHome /> : user.role === 'student' ? <StudentHome /> : user.role === 'admin' || user.role === 'sys_admin' ? <AdminHome /> : <NotFound />}
      />
    </Routes>
  );
}

const LogoutAction = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);
  return null;
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

