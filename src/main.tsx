import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializePerformanceMonitoring } from "./lib/advanced-performance";

// Initialize performance monitoring
initializePerformanceMonitoring();

const scheduleAnalyticsInitialization = () => {
  window.setTimeout(() => {
    import('./lib/firebase-analytics')
      .then(({ initializeFirebaseAnalytics }) => initializeFirebaseAnalytics())
      .catch((error) => console.error('Failed to initialize Firebase Analytics:', error));
  }, 3000);
};

if (document.readyState === 'complete') {
  scheduleAnalyticsInitialization();
} else {
  window.addEventListener('load', scheduleAnalyticsInitialization, { once: true });
}

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Error Loading Application</h1><p>Please refresh the page or clear your browser cache.</p></div>';
}
