import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapProps {
  onSkip?: () => void;
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onSkip }) => {
  const { signInWithGoogleCredential } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.accounts?.id) {
        // Initialize Google One Tap
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1:242203271636:web:a9418ae485bde9b145b641',
          callback: handleCredentialResponse,
          auto_select: true,
          cancel_on_tap_outside: false,
        });

        // Show One Tap prompt
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            // One Tap not shown - user has auto-select disabled or dismissed it
            console.log('One Tap not displayed:', notification.getNotDisplayedReason());
          }
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Send credential to backend for authentication
      await signInWithGoogleCredential(response.credential);

      toast({
        title: 'Success',
        description: 'Welcome back! You\'re now signed in.',
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error: any) {
      console.error('One Tap authentication error:', error);
      toast({
        title: 'Authentication failed',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });

      // Allow user to dismiss and try another method
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      }
    }
  };

  return null; // One Tap renders globally, no need for visible component
};

export default GoogleOneTap;
