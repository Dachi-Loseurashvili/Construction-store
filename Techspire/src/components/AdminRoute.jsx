import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useUser();
  
  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
