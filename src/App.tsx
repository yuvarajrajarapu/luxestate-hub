import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPropertyNew from "./pages/admin/AdminPropertyNew";
import AdminPropertyEdit from "./pages/admin/AdminPropertyEdit";
import AdminRoute from "./components/admin/AdminRoute";
import LandPlot from "./pages/land/LandPlot";
import LandAgricultural from "./pages/land/LandAgricultural";
import LandFarmHouses from "./pages/land/LandFarmHouses";

const queryClient = new QueryClient();

const App = () => {
  console.log("🚀 App component rendering...");
  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            {/* Land Routes */}
            <Route path="/land/plot" element={<LandPlot />} />
            <Route path="/land/agricultural" element={<LandAgricultural />} />
            <Route path="/land/farm-houses" element={<LandFarmHouses />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/property/new" element={<AdminRoute><AdminPropertyNew /></AdminRoute>} />
            <Route path="/admin/property/:id/edit" element={<AdminRoute><AdminPropertyEdit /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

};

export default App;
