import app from './firebase-app';

export const initializeFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null;

  const { getAnalytics, isSupported } = await import('firebase/analytics');
  if (!(await isSupported())) return null;

  return getAnalytics(app);
};
