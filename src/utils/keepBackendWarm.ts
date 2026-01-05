// utils/keepBackendWarm.ts
export const startBackendKeepWarm = () => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL as string || 
    "https://rad-course-work-hoterra-backend.vercel.app";

  // Ping every 5 minutes
  setInterval(() => {
    fetch(`${BACKEND_URL}/api/v1/ping`)
      .then(() => console.log("✓ Backend pinged"))
      .catch(err => console.log("⚠ Ping failed (this is OK):", err.message));
  }, 5 * 60 * 1000); // 5 minutes

  // Also ping on app start
  fetch(`${BACKEND_URL}/api/v1/ping`)
    .catch(err => console.log("⚠ Initial ping failed", err));

};

export const checkBackendHealth = async () => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL as string || 
    "https://rad-course-work-hoterra-backend.vercel.app";

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/health`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Health check failed:", err);
    return null;
  }
};