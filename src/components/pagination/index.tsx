import React from "react";
import type { PaginationProps } from "../../types";

/**
 * Pagination component used to navigate through pages of data.
 *
 * @param {PaginationProps} root0 Component properties.
 * @param {number} root0.totalItems Total number of items available.
 * @param {number} root0.itemsPerPage Number of items displayed per page.
 * @param {number} root0.currentPage Currently active page.
 * @param {(page: number) => void} root0.onPageChange Callback to update the current page.
 * @returns {JSX.Element} The rendered pagination UI.
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  /**
   * Generates the list of page numbers to display based on current page
   * and the maximum allowed visible page range.
   *
   * @returns {number[]} Array of page numbers.
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Customize how many pages to show

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  /**
   * Handles navigating to the previous page.
   * Decreases the current page index by 1 when possible.
   *
   * @returns {void} No return value.
   */
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  /**
   * Handles navigating to the next page.
   * Increases the current page index by 1 when possible.
   *
   * @returns {void} No return value.
   */
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination_design">
      <div className="row align-items-center">
        <div className="col-md">
          <p className="pagination_label">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
            to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems} results
          </p>
        </div>
        <div className="col-md">
          <ul className="pagi_design">
            <li
              onClick={handlePrev}
              className={currentPage === 1 ? "disabled" : "pointer"}
            >
              {/* Left arrow SVG */}
              <svg width={16} height={17} viewBox="0 0 16 17" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.8049 4.28035C8.06525 4.54069 8.06525 4.9628 7.8049 5.22315L4.94297 8.08508L7.8049 10.947C8.06525 11.2074 8.06525 11.6295 7.8049 11.8898C7.54455 12.1502 7.12244 12.1502 6.86209 11.8898L3.52876 8.55649C3.26841 8.29614 3.26841 7.87403 3.52876 7.61368L6.86209 4.28035C7.12244 4.02 7.54455 4.02 7.8049 4.28035Z"
                  fill="#525856"
                />
              </svg>
            </li>

            {getPageNumbers().map((page, idx) => (
              <li
                key={idx}
                className={
                  page === currentPage
                    ? "active"
                    : typeof page === "string"
                    ? "pointer-none"
                    : "pointer"
                }
                onClick={() => typeof page === "number" && onPageChange(page)}
              >
                <span>{page}</span>
              </li>
            ))}

            <li
              onClick={handleNext}
              className={currentPage === totalPages ? "disabled" : "pointer"}
            >
              {/* Right arrow SVG */}
              <svg width={16} height={17} viewBox="0 0 16 17" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.52864 3.61128C5.78899 3.35093 6.2111 3.35093 6.47145 3.61128L10.4714 7.61128C10.7318 7.87163 10.7318 8.29374 10.4714 8.55409L6.47145 12.5541C6.2111 12.8144 5.78899 12.8144 5.52864 12.5541C5.26829 12.2937 5.26829 11.8716 5.52864 11.6113L9.05723 8.08268L5.52864 4.55409C5.26829 4.29374 5.26829 3.87163 5.52864 3.61128Z"
                  fill="#525856"
                />
              </svg>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
