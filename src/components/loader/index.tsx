import React from "react";
import "./index.css";
import type { LoaderProps } from "../../types";

export const TableLoader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <tr>
      <td colSpan={7} className="table-loading-cell">
        <div className="loading-container">
          <div className="loading"></div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </td>
    </tr>
  );
};

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="loading-container">
      <div className="loading"></div>
      {text && <p className="loading-text-visible">{text}</p>}
    </div>
  );
};
