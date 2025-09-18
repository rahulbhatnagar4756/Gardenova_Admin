import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";
import { AppRoutes } from "./routes/routes";
import { AuthProvider } from "./contexts/AuthProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast Notifications - Now using Sonner package */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={true}
          visibleToasts={5}
          toastOptions={{
            duration: 5000,
            style: {
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
