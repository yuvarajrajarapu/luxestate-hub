import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentityServices {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select: boolean;
    cancel_on_tap_outside: boolean;
    itp_support: boolean;
  }) => void;
  prompt: () => void;
  cancel: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdentityServices;
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = 'google-one-tap-script';
let googleIdentityServicesPromise: Promise<GoogleIdentityServices> | undefined;
let initializedClientId: string | undefined;
let activeCredentialHandler:
  | ((response: GoogleCredentialResponse) => void)
  | undefined;

function loadGoogleIdentityServices(): Promise<GoogleIdentityServices> {
  const loadedApi = window.google?.accounts?.id;
  if (loadedApi) return Promise.resolve(loadedApi);
  if (googleIdentityServicesPromise) return googleIdentityServicesPromise;

  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
  const script = existingScript ?? document.createElement('script');

  googleIdentityServicesPromise = new Promise<GoogleIdentityServices>((resolve, reject) => {
    script.addEventListener(
      'load',
      () => {
        const api = window.google?.accounts?.id;
        if (api) {
          resolve(api);
        } else {
          reject(new Error('Google Identity Services loaded without its API.'));
        }
      },
      { once: true }
    );
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load Google Identity Services.')),
      { once: true }
    );

    if (!existingScript) {
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = GOOGLE_SCRIPT_ID;
      document.head.appendChild(script);
    }
  }).catch((error: unknown) => {
    googleIdentityServicesPromise = undefined;
    script.remove();
    throw error;
  });

  return googleIdentityServicesPromise;
}

const GoogleOneTap = () => {
  const { signInWithGoogleCredential } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
    if (!clientId?.endsWith('.apps.googleusercontent.com')) {
      console.warn(
        'Google One Tap is disabled. Configure VITE_GOOGLE_CLIENT_ID with a Google OAuth Web client ID.'
      );
      return;
    }

    let active = true;

    const handleCredentialResponse = async ({ credential }: GoogleCredentialResponse) => {
      if (!credential) {
        toast({
          title: 'Authentication failed',
          description: 'Google did not return a sign-in credential. Try the Google sign-in button.',
          variant: 'destructive',
        });
        return;
      }

      try {
        await signInWithGoogleCredential(credential);
        if (!active) return;

        toast({
          title: 'Success',
          description: "Welcome back! You're now signed in.",
        });
        navigate('/');
      } catch (error) {
        console.error('One Tap authentication error:', error);
        if (!active) return;

        toast({
          title: 'Authentication failed',
          description: error instanceof Error ? error.message : 'Failed to sign in with Google.',
          variant: 'destructive',
        });
      }
    };

    activeCredentialHandler = handleCredentialResponse;

    const initializeOneTap = async () => {
      try {
        const googleId = await loadGoogleIdentityServices();
        if (!active) return;

        if (initializedClientId !== clientId) {
          googleId.initialize({
            client_id: clientId,
            callback: (response) => {
              void activeCredentialHandler?.(response);
            },
            auto_select: true,
            cancel_on_tap_outside: true,
            itp_support: true,
          });
          initializedClientId = clientId;
        }

        googleId.prompt();
      } catch (error) {
        if (active) console.error('Failed to initialize Google One Tap:', error);
      }
    };

    void initializeOneTap();

    return () => {
      active = false;
      if (activeCredentialHandler === handleCredentialResponse) {
        activeCredentialHandler = undefined;
      }
      window.google?.accounts?.id?.cancel();
    };
  }, [navigate, signInWithGoogleCredential, toast]);

  return null;
};

export default GoogleOneTap;
