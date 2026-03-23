import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page = 1, pages = 1, onPageChange }) {
  // Generate visible pages with dots
  const getPageNumbers = () => {
    const total = pages;
    const current = page;
    const pagesSet = new Set();

    pagesSet.add(1);
    pagesSet.add(total);

    let start = Math.max(1, current - 1);
    let end = Math.min(total, current + 1);

    if (current <= 3) {
      start = 1;
      end = Math.min(4, total);
    }

    if (current >= total - 2) {
      start = Math.max(total - 3, 1);
      end = total;
    }

    for (let i = start; i <= end; i++) pagesSet.add(i);

    const sorted = [...pagesSet].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  };

  const visiblePages = getPageNumbers();

  return (
    <div className="flex items-center justify-between border-t border-(--border-light) px-6 py-4">
      <div className="text-sm text-gray-500">
        Page {page} of {pages}
      </div>

      <nav className="isolate inline-flex -space-x-px">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="relative inline-flex items-center rounded-l-md px-3 py-2 text-(--primary-600) bg-white hover:bg-(--primary-50) disabled:opacity-50 transition-colors"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Page numbers */}
        {visiblePages.map((pageNumber, idx) =>
          pageNumber === "..." ? (
            <span
              key={`dots-${idx}`}
              className="relative inline-flex items-center px-4 py-2 text-sm text-gray-400 cursor-default"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${pageNumber}-${idx}`}
              onClick={() => onPageChange(pageNumber)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-white transition-colors ${
                page === pageNumber
                  ? "bg-(--primary-500) text-white shadow-md"
                  : "bg-white text-(--primary-700) hover:bg-(--primary-100)"
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="relative inline-flex items-center rounded-r-md px-3 py-2 text-(--primary-600) bg-white hover:bg-(--primary-50) disabled:opacity-50 transition-colors"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
