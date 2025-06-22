import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { initializeTheme } from "@/lib/theme-script";
import { Toaster } from "sonner";
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

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;
