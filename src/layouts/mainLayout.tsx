import { Outlet } from "react-router-dom";
import "./layout.css";
import { Header } from "../components/header/header";
import { Sidebar } from "../components/sidebar/sidebar";
import { useState } from "react";

/**
 * Main layout wrapper for the application.
 *
 * Displays the sidebar, header, and nested routed pages using <Outlet />.
 *
 * @returns {JSX.Element} The main application layout.
 */
export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Toggles the sidebar visibility state.
   *
   * @returns {void}
   */
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  /**
   * Closes the sidebar by setting its state to false.
   *
   * @returns {void}
   */
  const closeSidebar = () => setIsSidebarOpen(false);
  return (
    <>
      <div className={`main_wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <Sidebar closeSidebar={closeSidebar} />
        <div className="inner_main_wrapper">
          <Header toggleSidebar={toggleSidebar} />
          <Outlet />
        </div>
      </div>
    </>
  );
};
