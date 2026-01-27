import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PropertyForm from '@/components/admin/PropertyForm';

const AdminPropertyNew: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <PropertyForm mode="create" />;
};

export default AdminPropertyNew;
