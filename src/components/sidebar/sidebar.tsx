import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import "./sidebar.css";
import { APP_ROUTES } from "../../constants/appRoutes";
import { useAuth } from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { decodePayload } from "../../utility/util";
import type { DecodedToken } from "../../types/auth";
import { useToast } from "../../hooks/useToast";
import { useState, type JSX } from "react";

/**
 * Sidebar component for admin navigation.
 *
 * Renders all admin menu links, logout button,
 * and handles navigation rules based on token validation.
 *
 * @param props Sidebar component props
 * @param props.closeSidebar Function to close the sidebar (mobile)
 * @returns {JSX.Element} The sidebar UI
 */
export const Sidebar = ({
  closeSidebar,
}: {
  closeSidebar: () => void;
}): JSX.Element => {
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const { showWarning, showSuccess, showError } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Validates the JWT token stored in localStorage.
   *
   * Checks:
   * - token exists
   * - token decodes correctly
   * - token is NOT expired
   * - user role === "Admin"
   *
   * @returns {boolean} Whether token is valid
   */
  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const decodedPayload = decodePayload(decoded);
      const isExpired = decodedPayload.exp * 1000 < Date.now();
      return !isExpired && decodedPayload.role === "Admin";
    } catch {
      return false;
    }
  };

  /**
   * Handles menu navigation behaviour.
   *
   * If token is invalid → user logged out automatically.
   * If user is already on same route → only closes sidebar.
   *
   * @param path The route to navigate to
   * @returns {void}
   */
  const handleMenuClick = (path: string) => {
    // Token invalid → logout
    if (!isTokenValid()) {
      logout();
      showWarning("Your session has expired or you're not authorized.");
      navigate(APP_ROUTES.auth.login, { replace: true });
      return;
    }

    // If already on page → just close sidebar
    if (location.pathname === path) {
      closeSidebar();
      return;
    }

    // Navigate then close menu
    navigate(path);
    closeSidebar();
  };

  /**
   * Trigger logout process when the logout button is clicked.
   *
   * Shows loader, performs logout, displays toast messages.
   *
   * @param e Click event from logout button
   * @returns {Promise<void>}
   */
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoggingOut(true);

    try {
      logout();
      showSuccess("You are successfully Logged Out");
      navigate(APP_ROUTES.auth.login, { replace: true });
    } catch {
      showError("Something went wrong...");
    } finally {
      setIsLoggingOut(false);
      closeSidebar();
    }
  };

  return (
    <div className="sidebar_main">
      {/* Logo Section */}
      <div className="dashboard_logo">
        <img src={logo} className="k_logo" alt="Logo" />
      </div>
      {/* Navigation Links */}
      <ul className="sidebar_links">
        {/* Dashboard Menu Item */}
        <li>
          <NavLink
            to={APP_ROUTES.admin.dashboard}
            className={({ isActive }) => (isActive ? "active" : "")}
            end
            onClick={() => handleMenuClick(APP_ROUTES.admin.dashboard)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.2269 4.24433C11.836 3.90807 11.2535 3.92419 10.8817 4.28155L4.30695 10.6024C4.11084 10.7909 4 11.0512 4 11.3233V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V16C8 14.3431 9.34315 13 11 13H13C14.6569 13 16 14.3431 16 16V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V11.3894C20 11.0981 19.873 10.8213 19.6521 10.6313L12.2269 4.24433ZM9.49565 2.83977C10.6108 1.76766 12.3584 1.7193 13.5311 2.72809L20.9563 9.11508C21.6189 9.685 22 10.5155 22 11.3894V19C22 20.6568 20.6569 22 19 22H17C15.3431 22 14 20.6568 14 19V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V19C10 20.6568 8.65685 22 7 22H5C3.34315 22 2 20.6568 2 19V11.3233C2 10.5071 2.33251 9.72622 2.92086 9.1606L9.49565 2.83977Z"
                fill="#F4F4F4"
              />
            </svg>
            <span>Dashboard</span>
          </NavLink>
        </li>
        {/* Professionals */}
        <li>
          <NavLink
            to={APP_ROUTES.admin.partnerProfiles}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => handleMenuClick(APP_ROUTES.admin.partnerProfiles)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 8C6 6.42376 6.47688 4.91358 7.51443 3.78701C8.56439 2.64699 10.0968 2 12 2C13.9032 2 15.4356 2.64699 16.4856 3.78701C17.5231 4.91358 18 6.42376 18 8H20C21.1046 8 22 8.89543 22 10V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V10C2 8.89543 2.89543 8 4 8H6ZM8 8C8 6.81481 8.35645 5.825 8.98557 5.14192C9.60228 4.4723 10.5698 4 12 4C13.4302 4 14.3977 4.4723 15.0144 5.14192C15.6435 5.825 16 6.81481 16 8H8ZM20 12V10H4V12H20ZM4 20V14H20V20H4Z"
                fill="#F4F4F4"
              />
            </svg>
            <span>Plants</span>
          </NavLink>
        </li>
        {/* Plant Catalog */}
        <li>
          <NavLink
            to={APP_ROUTES.admin.plantCatalog}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => handleMenuClick(APP_ROUTES.admin.plantCatalog)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.5 2 6 5 6 8.5C6 12.5 10 16 12 21C14 16 18 12.5 18 8.5C18 5 15.5 2 12 2Z"
                stroke="#F4F4F4"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M12 21V10"
                stroke="#F4F4F4"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span>Plant Catalog</span>
          </NavLink>
        </li>
        {/* Admin Users */}
        <li>
          <NavLink
            to={APP_ROUTES.admin.adminUsers}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => handleMenuClick(APP_ROUTES.admin.adminUsers)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z"
                fill="#F4F4F4"
              />
              <path
                d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z"
                fill="#F4F4F4"
              />
              <path
                d="M8 13C5.23858 13 3 15.2386 3 18V19C3 19.5523 3.44772 20 4 20H12C12.5523 20 13 19.5523 13 19V18C13 15.2386 10.7614 13 8 13Z"
                fill="#F4F4F4"
              />
              <path
                d="M16.5 13C14.8783 13 13.4516 13.7904 12.5752 15.0007C13.4701 15.8711 14 17.0533 14 18.25V19C14 19.1712 13.9829 19.3389 13.9502 19.5023H20C20.5523 19.5023 21 19.0546 21 18.5023V18.25C21 15.3505 18.6495 13 15.75 13H16.5Z"
                fill="#F4F4F4"
              />
            </svg>
            <span>Users</span>
          </NavLink>
        </li>
        {/* Diagnosis Scans */}
        <li>
          <NavLink
            to={APP_ROUTES.admin.diagnosisScans}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => handleMenuClick(APP_ROUTES.admin.diagnosisScans)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 5C4 3.89543 4.89543 3 6 3H14L20 9V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5Z"
                stroke="#F4F4F4"
                strokeWidth="1.6"
              />
              <path
                d="M14 3V9H20"
                stroke="#F4F4F4"
                strokeWidth="1.6"
              />
              <path
                d="M8 13H16M8 17H13"
                stroke="#F4F4F4"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span>Diagnosis Scans</span>
          </NavLink>
        </li>
        {/* Diagnostic Questions */}
        <li>
          <NavLink
            to={APP_ROUTES.admin.diagnosticQuestions}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() =>
              handleMenuClick(APP_ROUTES.admin.diagnosticQuestions)
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 11C8 10.4477 8.44772 10 9 10H15C15.5523 10 16 10.4477 16 11C16 11.5523 15.5523 12 15 12H9C8.44772 12 8 11.5523 8 11Z"
                fill="#F4F4F4"
              />
              <path
                d="M8 14C8 13.4477 8.44772 13 9 13H15C15.5523 13 16 13.4477 16 14C16 14.5523 15.5523 15 15 15H9C8.44772 15 8 14.5523 8 14Z"
                fill="#F4F4F4"
              />
              <path
                d="M9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18H15C15.5523 18 16 17.5523 16 17C16 16.4477 15.5523 16 15 16H9Z"
                fill="#F4F4F4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.8293 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H7.17071C7.58254 2.83481 8.69378 2 10 2H14C15.3062 2 16.4175 2.83481 16.8293 4ZM7.17071 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16.8293C16.4175 7.16519 15.3062 8 14 8H10C8.69378 8 7.58254 7.16519 7.17071 6ZM9 5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5Z"
                fill="#F4F4F4"
              />
            </svg>
            <span>Diagnostic Questions</span>
          </NavLink>
        </li>
        {/* Leads */}
        <li>
          {/* <NavLink
            to={APP_ROUTES.admin.leads}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => handleMenuClick(APP_ROUTES.admin.leads)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.0978 2.89803C10.6965 1.05541 13.3033 1.05541 13.902 2.89803L15.5592 7.99851H20.9222C22.8596 7.99851 23.6652 10.4777 22.0978 11.6165L17.759 14.7688L19.4163 19.8693C20.015 21.7119 17.906 23.2442 16.3386 22.1054L11.9999 18.9531L7.66116 22.1054C6.09373 23.2442 3.98477 21.7119 4.58347 19.8693L6.24072 14.7688L1.90199 11.6165C0.334568 10.4777 1.14011 7.99851 3.07756 7.99851H8.44052L10.0978 2.89803ZM11.9999 3.51607L9.89361 9.99851L3.07756 9.99851L8.59186 14.0049L6.48559 20.4873L11.9999 16.481L17.5142 20.4873L15.4079 14.0049L20.9222 9.99851H14.1062L11.9999 3.51607Z"
                fill="#F4F4F4"
              />
            </svg>
            <span>Leads</span>
          </NavLink> */}
        </li>
        {/* Create Rules */}
        <li>
          {/* <NavLink
            to={APP_ROUTES.admin.rules}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => handleMenuClick(APP_ROUTES.admin.rules)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 1C3.23858 1 1 3.23858 1 6C1 8.41896 2.71776 10.4367 5 10.9V13H2C1.44772 13 1 13.4477 1 14V22C1 22.5523 1.44772 23 2 23H10C10.5523 23 11 22.5523 11 22V14C11 13.4477 10.5523 13 10 13H7V10.9C8.95913 10.5023 10.5023 8.95913 10.9 7H13.5858L17 10.4142V13.1C14.7178 13.5633 13 15.581 13 18C13 20.7614 15.2386 23 18 23C20.7614 23 23 20.7614 23 18C23 15.581 21.2822 13.5633 19 13.1V10.4142L22.7071 6.7072C23.0976 6.31667 23.0976 5.68351 22.7071 5.29298L18.7071 1.29293C18.5196 1.10539 18.2652 1.00003 18 1.00003C17.7348 1.00003 17.4804 1.10538 17.2929 1.29292L13.5858 5L10.9 5C10.4367 2.71776 8.41896 1 6 1ZM3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6ZM18 3.41425L15.4142 6.00003L18 8.58582L20.5858 6.00007L18 3.41425ZM3 15V21H9V15H3ZM18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15Z"
                fill="#F4F4F4"
              />
            </svg>
            <span>Create Rules</span>
          </NavLink> */}
        </li>
        {/* Knowledge Library */}
        {/* <li>
          <NavLink
            to={APP_ROUTES.admin.knowledgeLibrary}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => handleMenuClick(APP_ROUTES.admin.knowledgeLibrary)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  stroke="#F4F4F4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 9v11M4 9h16M4 9H3l9-5 9 5h-1M4 20h16M4 20H3m17 0V9m0 11h1M8 13v3m4 0v-3m4 0v3"
                ></path>
              </g>
            </svg>
            <span>Knowledge Library</span>
          </NavLink>
        </li> */}
      </ul>
      {/* Logout Section */}
      <div className="logout_btn text-center">
        <a
          href=""
          onClick={handleLogout}
          style={{ pointerEvents: isLoggingOut ? "none" : "auto" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 16C9.73478 16 9.48043 16.1054 9.29289 16.2929C9.10536 16.4804 9 16.7348 9 17V20C9 20.7956 9.31607 21.5587 9.87868 22.1213C10.4413 22.6839 11.2044 23 12 23H19C19.7956 23 20.5587 22.6839 21.1213 22.1213C21.6839 21.5587 22 20.7956 22 20V4C22 3.20435 21.6839 2.44129 21.1213 1.87868C20.5587 1.31607 19.7956 1 19 1H12C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V7C9 7.26522 9.10536 7.51957 9.29289 7.70711C9.48043 7.89464 9.73478 8 10 8C10.2652 8 10.5196 7.89464 10.7071 7.70711C10.8946 7.51957 11 7.26522 11 7V4C11 3.73478 11.1054 3.48043 11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3H19C19.2652 3 19.5196 3.10536 19.7071 3.29289C19.8946 3.48043 20 3.73478 20 4V20C20 20.2652 19.8946 20.5196 19.7071 20.7071C19.5196 20.8946 19.2652 21 19 21H12C11.7348 21 11.4804 20.8946 11.2929 20.7071C11.1054 20.5196 11 20.2652 11 20V17C11 16.7348 10.8946 16.4804 10.7071 16.2929C10.5196 16.1054 10.2652 16 10 16Z"
              fill="#f4f4f4"
            />
            <path
              d="M4.414 13L6.707 15.293C6.88916 15.4816 6.98995 15.7342 6.98767 15.9964C6.9854 16.2586 6.88023 16.5094 6.69482 16.6948C6.50941 16.8802 6.2586 16.9854 5.9964 16.9877C5.7342 16.99 5.4816 16.8892 5.293 16.707L1.293 12.707C1.10553 12.5195 1.00021 12.2652 1.00021 12C1.00021 11.7349 1.10553 11.4805 1.293 11.293L5.293 7.29302C5.38525 7.19751 5.49559 7.12133 5.6176 7.06892C5.7396 7.01651 5.87082 6.98892 6.0036 6.98777C6.13638 6.98662 6.26806 7.01192 6.39095 7.0622C6.51385 7.11248 6.6255 7.18673 6.71939 7.28062C6.81329 7.37452 6.88754 7.48617 6.93782 7.60907C6.9881 7.73196 7.0134 7.86364 7.01225 7.99642C7.0111 8.1292 6.98351 8.26042 6.9311 8.38242C6.87869 8.50443 6.80251 8.61477 6.707 8.70702L4.414 11H14C14.2652 11 14.5196 11.1054 14.7071 11.2929C14.8946 11.4804 15 11.7348 15 12C15 12.2652 14.8946 12.5196 14.7071 12.7071C14.5196 12.8947 14.2652 13 14 13H4.414Z"
              fill="#f4f4f4"
            />
          </svg>
          <span>
            {isLoggingOut ? (
              <div className="spinner-border spinner-border-sm text-light" />
            ) : (
              "Log Out"
            )}
          </span>
        </a>
      </div>
    </div>
  );
};
