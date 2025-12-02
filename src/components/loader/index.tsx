import React from "react";
import "./index.css";
import type { LoaderProps } from "../../types";

/**
 * Table loader component used to display a loading animation
 * inside a table row while data is being fetched.
 *
 * @param {LoaderProps} root0 Component props.
 * @param {string} [root0.text] Optional text shown below the loader.
 * @returns {JSX.Element} The table loader row.
 */
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

/**
 * General-purpose loader component used outside tables,
 * showing a spinner and optional message during data loading.
 *
 * @param {LoaderProps} root0 Component props.
 * @param {string} [root0.text] Optional text displayed below the loader.
 * @returns {JSX.Element} The loader element.
 */
export const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="loading-container">
      <div className="loading"></div>
      {text && <p className="loading-text-visible">{text}</p>}
    </div>
  );
};
