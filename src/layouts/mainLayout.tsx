import { Outlet } from "react-router-dom";
import "./layout.css";
import { Header } from "../components/header/header";
import { Sidebar } from "../components/sidebar/sidebar";

export const MainLayout = () => {
  return (
    <>
      <div className="main_wrapper">
        <Sidebar />
        <div className="inner_main_wrapper">
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
};
