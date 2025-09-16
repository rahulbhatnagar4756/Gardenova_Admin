import { NavLink, useNavigate } from "react-router-dom";
import { Home, HelpCircle, Users, BarChart3, LogOut } from "lucide-react";
import "./sidebar.css";
import { APP_ROUTES } from "../../constants/appRoutes";
import { useAuth } from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userEmail: string;
  role: string;
  iat: number;
  exp: number;
}

export const Sidebar = () => {
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const navItems = [
    {
      path: APP_ROUTES.admin.dashboard,
      label: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      path: APP_ROUTES.admin.diagnosticQuestions,
      label: "Diagnostic Questions",
      icon: <HelpCircle size={20} />,
    },
    {
      path: APP_ROUTES.admin.partnerProfiles,
      label: "Partner Profiles",
      icon: <Users size={20} />,
    },
    {
      path: APP_ROUTES.admin.leads,
      label: "Leads",
      icon: <BarChart3 size={20} />,
    },
  ];

  // Token validation (same as in AuthProvider)
  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired && decoded.role === "Admin";
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.auth.login, { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              end={item.path === APP_ROUTES.admin.dashboard}
              onClick={(e) => {
                if (!isTokenValid()) {
                  e.preventDefault();
                  logout();
                  alert("Your session has expired or you're not authorized.");
                  navigate(APP_ROUTES.auth.login, { replace: true });
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
