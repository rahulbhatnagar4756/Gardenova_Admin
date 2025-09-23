import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";
import { AppRoutes } from "./routes/routes";
import { AuthProvider } from "./contexts/AuthProvider";
import { ToastContainer } from "./components/toastContainer";
import { ToastProvider } from "./contexts/ToastProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
