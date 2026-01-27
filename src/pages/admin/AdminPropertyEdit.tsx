import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PropertyForm from '@/components/admin/PropertyForm';

const AdminPropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  if (!id) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <PropertyForm mode="edit" propertyId={id} />;
};

export default AdminPropertyEdit;
