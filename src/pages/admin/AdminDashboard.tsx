import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Home,
  Users,
  TrendingUp,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Property, PROPERTY_CATEGORIES } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getOptimizedUrl } from '@/lib/cloudinary';

const AdminDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, categoryFilter]);

  const fetchProperties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const propertiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await deleteDoc(doc(db, 'properties', propertyToDelete));
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const toggleFeatured = async (propertyId: string, currentValue: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        isFeatured: !currentValue,
      });
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, isFeatured: !currentValue } : p
        )
      );
      toast.success(currentValue ? 'Removed from featured' : 'Added to featured');
    } catch (error) {
      toast.error('Failed to update property');
    }
  };

  const toggleSoldOut = async (propertyId: string, currentValue: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        isSoldOut: !currentValue,
      });
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, isSoldOut: !currentValue } : p
        )
      );
      toast.success(currentValue ? 'Marked as available' : 'Marked as sold out');
    } catch (error) {
      toast.error('Failed to update property');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const stats = [
    {
      label: 'Total Properties',
      value: properties.length,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Featured',
      value: properties.filter((p) => p.isFeatured).length,
      icon: Star,
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'For Sale',
      value: properties.filter((p) => p.listingType === 'sale').length,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'For Rent',
      value: properties.filter((p) => p.listingType === 'rent').length,
      icon: Home,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">Admin Dashboard</h1>
                <p className="text-xs text-slate-500">Yuva InfraEdge</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Welcome, {userData?.username || 'Admin'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {PROPERTY_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            asChild
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 gap-2"
          >
            <Link to="/admin/property/new">
              <Plus className="w-5 h-5" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-slate-500">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No properties found</p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/admin/property/new">Add your first property</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-4 px-4 font-medium text-slate-600 text-sm">
                      Property
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-slate-600 text-sm">
                      Category
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-slate-600 text-sm">
                      Price
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-slate-600 text-sm">
                      Status
                    </th>
                    <th className="text-right py-4 px-4 font-medium text-slate-600 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property, index) => (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100">
                            {property.images[0] ? (
                              <img
                                src={getOptimizedUrl(property.images[0].url, {
                                  width: 100,
                                  height: 75,
                                })}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Building2 className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 line-clamp-1">
                              {property.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              {property.location}, {property.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="font-normal">
                          {PROPERTY_CATEGORIES.find((c) => c.value === property.category)
                            ?.label || property.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900">
                          ₹{property.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-slate-500">
                          {property.priceUnit === 'per-month' && '/month'}
                          {property.priceUnit === 'per-year' && '/year'}
                          {property.priceUnit === 'per-sqft' && '/sq.ft'}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {property.isFeatured && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              Featured
                            </Badge>
                          )}
                          {property.isSoldOut ? (
                            <Badge variant="destructive">Sold Out</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Active
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/property/${property.id}`}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/admin/property/${property.id}/edit`}
                                className="flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toggleFeatured(property.id, property.isFeatured)
                              }
                            >
                              <Star className="w-4 h-4 mr-2" />
                              {property.isFeatured ? 'Remove Featured' : 'Mark Featured'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toggleSoldOut(property.id, property.isSoldOut)
                              }
                            >
                              {property.isSoldOut ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Available
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Mark Sold Out
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setPropertyToDelete(property.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be
              undone and all associated media will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
