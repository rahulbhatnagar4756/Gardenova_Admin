import { Outlet } from "react-router-dom";
import "./layout.css";
import { Header } from "../components/header/header";
import { Sidebar } from "../components/sidebar/sidebar";
import { useState } from "react";

export const MainLayout = () => {
 
  return (
    // <div className="main-layout">
    //   <Header />
    //   <div className="layout-body">
    //     <Sidebar />
    //     <main className="content-area">
    //       <Outlet />
    //     </main>
    //   </div>
    // </div>

    <>
    <div className="main_wrapper">
       <Sidebar />
      <div className="inner_main_wrapper">
        <Header  />
        <Outlet />
      </div>
    </div>
    </>
  );
};
