import { Navigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!user) return <Navigate to="/login" />;

  // Si un filtre de rôle est défini
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
