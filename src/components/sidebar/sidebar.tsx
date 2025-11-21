import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import "./sidebar.css";
import { APP_ROUTES } from "../../constants/appRoutes";
import { useAuth } from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { decodePayload } from "../../utility/util";
import type { DecodedToken } from "../../types/auth";
import { useToast } from "../../hooks/useToast";
import { useState } from "react";

export const Sidebar = () => {
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { showWarning, showSuccess, showError } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Token validation (same as in AuthProvider)
  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Decode base64 only for string fields
      const decodedPayload = decodePayload(decoded);
      const isExpired = decodedPayload.exp * 1000 < Date.now();
      return !isExpired && decodedPayload.role === "Admin";
    } catch {
      return false;
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoggingOut(true);

    try {
      logout();
      showSuccess("You are successfully Logged Out");
      navigate(APP_ROUTES.auth.login, { replace: true });
    } catch {
      showError("Something Went Wrong...");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle navigation with token validation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isTokenValid()) {
      e.preventDefault();
      logout();
      showWarning("Your session has expired or you're not authorized.");
      navigate(APP_ROUTES.auth.login, { replace: true });
    }
  };

  const handleClose = () => {
    document.body.classList.remove("sidebar-expand");
  };

  return (
    <div className="sidebar_main">
      <div className="close_btn d-lg-none">
        <a href="javascript:void(0)">
          <span onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
            </svg>
          </span>
        </a>
      </div>
      <div className="dashboard_logo">
        <a>
          <img src={logo} className="k_logo" alt="Logo" />
        </a>
      </div>
      <ul className="sidebar_links">
        <li>
          <NavLink
            to={APP_ROUTES.admin.dashboard}
            className={({ isActive }) => (isActive ? "active" : "")}
            end={true}
            onClick={handleNavClick}
          >
            
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2269 4.24433C11.836 3.90807 11.2535 3.92419 10.8817 4.28155L4.30695 10.6024C4.11084 10.7909 4 11.0512 4 11.3233V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V16C8 14.3431 9.34315 13 11 13H13C14.6569 13 16 14.3431 16 16V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V11.3894C20 11.0981 19.873 10.8213 19.6521 10.6313L12.2269 4.24433ZM9.49565 2.83977C10.6108 1.76766 12.3584 1.7193 13.5311 2.72809L20.9563 9.11508C21.6189 9.685 22 10.5155 22 11.3894V19C22 20.6568 20.6569 22 19 22H17C15.3431 22 14 20.6568 14 19V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V19C10 20.6568 8.65685 22 7 22H5C3.34315 22 2 20.6568 2 19V11.3233C2 10.5071 2.33251 9.72622 2.92086 9.1606L9.49565 2.83977Z" fill="#F4F4F4"/>
            </svg>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={APP_ROUTES.admin.partnerProfiles}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 8C6 6.42376 6.47688 4.91358 7.51443 3.78701C8.56439 2.64699 10.0968 2 12 2C13.9032 2 15.4356 2.64699 16.4856 3.78701C17.5231 4.91358 18 6.42376 18 8H20C21.1046 8 22 8.89543 22 10V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V10C2 8.89543 2.89543 8 4 8H6ZM8 8C8 6.81481 8.35645 5.825 8.98557 5.14192C9.60228 4.4723 10.5698 4 12 4C13.4302 4 14.3977 4.4723 15.0144 5.14192C15.6435 5.825 16 6.81481 16 8H8ZM20 12V10H4V12H20ZM4 20V14H20V20H4Z" fill="#F4F4F4"/>
            </svg>
            <span>Professionals</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={APP_ROUTES.admin.diagnosticQuestions}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            
          
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 11C8 10.4477 8.44772 10 9 10H15C15.5523 10 16 10.4477 16 11C16 11.5523 15.5523 12 15 12H9C8.44772 12 8 11.5523 8 11Z" fill="#F4F4F4"/>
<path d="M8 14C8 13.4477 8.44772 13 9 13H15C15.5523 13 16 13.4477 16 14C16 14.5523 15.5523 15 15 15H9C8.44772 15 8 14.5523 8 14Z" fill="#F4F4F4"/>
<path d="M9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18H15C15.5523 18 16 17.5523 16 17C16 16.4477 15.5523 16 15 16H9Z" fill="#F4F4F4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.8293 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H7.17071C7.58254 2.83481 8.69378 2 10 2H14C15.3062 2 16.4175 2.83481 16.8293 4ZM7.17071 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16.8293C16.4175 7.16519 15.3062 8 14 8H10C8.69378 8 7.58254 7.16519 7.17071 6ZM9 5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5Z" fill="#F4F4F4"/>
</svg>


            <span>Diagnostic Questions</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={APP_ROUTES.admin.leads}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0978 2.89803C10.6965 1.05541 13.3033 1.05541 13.902 2.89803L15.5592 7.99851H20.9222C22.8596 7.99851 23.6652 10.4777 22.0978 11.6165L17.759 14.7688L19.4163 19.8693C20.015 21.7119 17.906 23.2442 16.3386 22.1054L11.9999 18.9531L7.66116 22.1054C6.09373 23.2442 3.98477 21.7119 4.58347 19.8693L6.24072 14.7688L1.90199 11.6165C0.334568 10.4777 1.14011 7.99851 3.07756 7.99851H8.44052L10.0978 2.89803ZM11.9999 3.51607L9.89361 9.99851L3.07756 9.99851L8.59186 14.0049L6.48559 20.4873L11.9999 16.481L17.5142 20.4873L15.4079 14.0049L20.9222 9.99851H14.1062L11.9999 3.51607Z" fill="#F4F4F4"/>
            </svg>
            <span>Leads</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={APP_ROUTES.admin.rules}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            
            
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6 1C3.23858 1 1 3.23858 1 6C1 8.41896 2.71776 10.4367 5 10.9V13H2C1.44772 13 1 13.4477 1 14V22C1 22.5523 1.44772 23 2 23H10C10.5523 23 11 22.5523 11 22V14C11 13.4477 10.5523 13 10 13H7V10.9C8.95913 10.5023 10.5023 8.95913 10.9 7H13.5858L17 10.4142V13.1C14.7178 13.5633 13 15.581 13 18C13 20.7614 15.2386 23 18 23C20.7614 23 23 20.7614 23 18C23 15.581 21.2822 13.5633 19 13.1V10.4142L22.7071 6.7072C23.0976 6.31667 23.0976 5.68351 22.7071 5.29298L18.7071 1.29293C18.5196 1.10539 18.2652 1.00003 18 1.00003C17.7348 1.00003 17.4804 1.10538 17.2929 1.29292L13.5858 5L10.9 5C10.4367 2.71776 8.41896 1 6 1ZM3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6ZM18 3.41425L15.4142 6.00003L18 8.58582L20.5858 6.00007L18 3.41425ZM3 15V21H9V15H3ZM18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15Z" fill="#F4F4F4"/>
          </svg>

            <span>Create Rules</span>
          </NavLink>
        </li>
      </ul>

      <div className="logout_btn text-center">
        <a
          href=""
          onClick={handleLogout}
          style={{ pointerEvents: isLoggingOut ? "none" : "auto" }}
        >
          <span>
            {isLoggingOut ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              ></div>
            ) : (
              "Log Out"
            )}
          </span>
        </a>
      </div>
    </div>
  );
};
