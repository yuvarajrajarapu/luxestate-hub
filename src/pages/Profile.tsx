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

const Profile = () => {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
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
                    0 Shortlisted
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
                              <p className="text-gray-900 font-medium">0 Properties</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="shortlisted" className="mt-0">
                  <EmptyState 
                    icon={Heart}
                    title="No shortlisted properties!"
                    description="Save your favorite properties here by clicking the heart icon"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">My Activity</h2>
                    <nav className="space-y-2">
                      <button
                        onClick={() => setActiveTab('profile')}
                        className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                          activeTab === 'profile' 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setActiveTab('shortlisted')}
                        className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                          activeTab === 'shortlisted' 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Shortlisted
                      </button>
                    </nav>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <Button
                      onClick={handleLogout}
                      className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                      variant="outline"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
