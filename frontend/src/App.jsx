import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './context/authStore';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServicesPage from './pages/ServicesPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import ComplaintsPage from './pages/ComplaintsPage';
import NewComplaintPage from './pages/NewComplaintPage';
import UserDashboardPage from './pages/UserDashboardPage';
import WorkerDashboardPage from './pages/WorkerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Route Guards
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="workers/:id" element={<WorkerProfilePage />} />
        <Route path="complaints" element={<ComplaintsPage />} />

        {/* Auth routes */}
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected - User */}
        <Route path="dashboard" element={<PrivateRoute roles={['user']}><UserDashboardPage /></PrivateRoute>} />
        <Route path="complaints/new" element={<PrivateRoute><NewComplaintPage /></PrivateRoute>} />

        {/* Protected - Worker */}
        <Route path="worker-dashboard" element={<PrivateRoute roles={['worker']}><WorkerDashboardPage /></PrivateRoute>} />

        {/* Protected - Admin */}
        <Route path="admin" element={<PrivateRoute roles={['admin']}><AdminDashboardPage /></PrivateRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
