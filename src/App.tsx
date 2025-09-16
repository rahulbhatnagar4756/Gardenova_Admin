import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import { AppRoutes } from "./routes/routes";
import { AuthProvider } from "./contexts/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
