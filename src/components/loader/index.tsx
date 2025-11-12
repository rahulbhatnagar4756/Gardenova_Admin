import React from "react";
import "./index.css";

interface TableLoaderProps {
  text?: string;
}

const TableLoader: React.FC<TableLoaderProps> = ({ text }) => {
  return (
    <tr>
      <td colSpan={7} className="table-loading-cell">
        <div className="loading-container" style={{ minHeight: "200px" }}>
          <div className="loading"></div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </td>
    </tr>
  );
};

export default TableLoader;
