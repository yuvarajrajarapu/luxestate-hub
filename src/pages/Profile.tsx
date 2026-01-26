import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, LogOut, Mail, Calendar, User as UserIcon } from 'lucide-react';
import { useShortlist } from '@/hooks/useShortlist';
import { getUserShortlistedProperties } from '@/lib/shortlist';
import PropertyCard from '@/components/property/PropertyCard';
import type { Property } from '@/types/property';

const Profile = () => {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const { shortlistedIds, loading: shortlistLoading } = useShortlist();
  const [shortlistedProperties, setShortlistedProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch shortlisted properties
  useEffect(() => {
    const fetchShortlistedProperties = async () => {
      if (!user) {
        setLoadingProperties(false);
        return;
      }
      
      // Wait for shortlist IDs to load first
      if (shortlistLoading) {
        return;
      }

      // If no shortlisted items, stop loading
      if (shortlistedIds.length === 0) {
        setShortlistedProperties([]);
        setLoadingProperties(false);
        return;
      }

      setLoadingProperties(true);
      try {
        console.log('Fetching shortlisted properties for user:', user.uid);
        console.log('Shortlisted IDs:', shortlistedIds);
        const properties = await getUserShortlistedProperties(user.uid);
        console.log('Fetched properties:', properties);
        setShortlistedProperties(properties);
      } catch (error) {
        console.error('Error fetching shortlisted properties:', error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchShortlistedProperties();
  }, [user, shortlistedIds.length, shortlistLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null;
  }

  const userInitials = userData?.username
    ? userData.username.substring(0, 2).toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'U';

  const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <Icon className="w-24 h-24 text-blue-500" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {/* Main Content */}
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="profile" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shortlisted" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
                  >
                    {shortlistedIds.length} Shortlisted
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-8">
                  <Card className="border-gray-200">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-6 mb-8">
                        <Avatar className="w-24 h-24 bg-blue-600 text-white text-3xl">
                          <AvatarFallback className="bg-blue-600 text-white">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-3xl font-semibold text-gray-900">
                            {userData?.username || user.email?.split('@')[0]}
                          </h2>
                          <p className="text-gray-600 mt-1">Member Account</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <Mail className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Email Address</p>
                              <p className="text-gray-900 font-medium">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Member Since</p>
                              <p className="text-gray-900 font-medium">
                                {new Date(user.metadata?.creationTime || '').toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Username</p>
                              <p className="text-gray-900 font-medium">
                                {userData?.username || user.email?.split('@')[0]}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <Heart className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Saved Properties</p>
                              <p className="text-gray-900 font-medium">{shortlistedIds.length} Properties</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Logout Button */}
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-transparent"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="shortlisted" className="mt-0">
                  {loadingProperties ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Loading your shortlisted properties...</p>
                    </div>
                  ) : shortlistedProperties.length === 0 ? (
                    <EmptyState 
                      icon={Heart}
                      title="No shortlisted properties!"
                      description="Save your favorite properties here by clicking the heart icon"
                    />
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                      {shortlistedProperties.map((property, index) => (
                        <PropertyCard key={property.id} property={property} index={index} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
