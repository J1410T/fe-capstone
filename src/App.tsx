import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { initializeTheme } from "@/lib/theme-script";
import { Toaster } from "sonner";
import { routes } from "./routes/config";
import { QueryProvider } from "./contexts/QueryProvider";
import { SignalRProvider } from "./contexts/SignalRProvider";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
    <QueryProvider>
      <SignalRProvider>
        <RouterProvider router={router} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <Toaster position="top-right" richColors closeButton />
      </SignalRProvider>
    </QueryProvider>
  );
}

export default App;
