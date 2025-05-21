import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { initializeTheme } from "@/lib/theme-script";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { routes } from "./routes/config";

// Create browser router
const router = createBrowserRouter(routes);

/**
 * Main App component
 * Initializes theme and renders the router
 */
function App(): React.ReactElement {
  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme();
  }, []);

  // Use a mock client ID for testing without backend
  const mockClientId =
    "658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={mockClientId}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </GoogleOAuthProvider>
  );
}

export default App;
