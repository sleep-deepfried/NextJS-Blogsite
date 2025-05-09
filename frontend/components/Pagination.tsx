import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If the total pages is less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last pages
      const firstPage = 1;
      const lastPage = totalPages;

      // Calculate how many pages to show around current page
      const leftSide = Math.floor(maxPagesToShow / 2);
      const rightSide = maxPagesToShow - leftSide - 1;

      // Calculate start and end pages
      let startPage = Math.max(currentPage - leftSide, 1);
      let endPage = Math.min(currentPage + rightSide, totalPages);

      // Adjust if we're near the beginning or end
      if (startPage === 1) {
        endPage = Math.min(maxPagesToShow, totalPages);
      }
      if (endPage === totalPages) {
        startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
      }

      // Add pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (startPage > 1) {
        pages.unshift("...");
        pages.unshift(1);
      }

      if (endPage < totalPages) {
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex justify-center my-8">
      <ul className="flex items-center space-x-2">
        {/* Previous page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            &laquo;
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
