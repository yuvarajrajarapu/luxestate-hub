import { useEffect, useRef } from 'react';
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
          cancel: () => void;
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
  const scriptLoadedRef = useRef(false);
  const promptShownRef = useRef(false);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Send credential to backend for authentication
      await signInWithGoogleCredential(response.credential);

      toast({
        title: 'Success',
        description: 'Welcome back! You\'re now signed in.',
      });

      // Redirect to home after a short delay
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

      // Re-prompt after failure
      if (window.google?.accounts?.id && !promptShownRef.current) {
        window.google.accounts.id.prompt();
      }
    }
  };

  useEffect(() => {
    // Only load script once
    if (scriptLoadedRef.current) return;

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-one-tap-script';

    script.onload = () => {
      scriptLoadedRef.current = true;

      if (window.google?.accounts?.id) {
        try {
          // Initialize Google One Tap with proper configuration
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1:242203271636:web:a9418ae485bde9b145b641',
            callback: handleCredentialResponse,
            auto_select: true,
            cancel_on_tap_outside: true,
            itp_support: true, // Support Intelligent Tracking Prevention (Safari)
          });

          // Show One Tap prompt
          window.google.accounts.id.prompt((notification) => {
            promptShownRef.current = true;

            // Handle different notification states
            if (notification.isNotDisplayed()) {
              const reason = notification.getNotDisplayedReason();
              console.debug('One Tap not displayed:', reason);
              // User dismissed or has auto-select disabled - this is normal
            } else if (notification.isSkippedMoment()) {
              console.debug('One Tap skipped');
              // User clicked "Skip" - respect their choice
            } else if (notification.isDismissedMoment()) {
              console.debug('One Tap dismissed');
              // User closed the prompt
            }
          });
        } catch (error) {
          console.error('Failed to initialize Google One Tap:', error);
        }
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
    };

    // Check if script already exists (e.g., on page re-render)
    const existingScript = document.getElementById('google-one-tap-script');
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      scriptLoadedRef.current = true;
    }

    return () => {
      // Don't remove script on unmount - let it persist across pages
      // Only cancel the prompt if user is navigating away
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          // Safely ignore cancel errors
        }
      }
    };
  }, []);

  return null; // One Tap renders globally, no visible component needed
};

export default GoogleOneTap;
