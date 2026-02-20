import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;