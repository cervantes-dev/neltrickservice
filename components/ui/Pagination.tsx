import { ChevronLeft, ChevronRight } from "@mui/icons-material";


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  total: number; // 👈 add this
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, total, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-green/10">

      {/* Left — showing count */}
      <p className="text-xs text-gray-400">
        Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, total)} of {total} users
      </p>

      {/* Right — page controls */}
      <div className="flex items-center gap-1">

        {/* Prev */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 h-8 rounded-md border border-gray-200 text-xs text-gray-500 hover:bg-brand-green/5 hover:text-brand-green hover:border-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft fontSize="small" /> Prev
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md border text-xs font-medium transition-all
          ${currentPage === page
                ? "bg-brand-green text-white border-brand-green"
                : "border-gray-200 text-gray-500 hover:bg-brand-green/5 hover:text-brand-green hover:border-brand-green/20"
              }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 h-8 rounded-md border border-gray-200 text-xs text-gray-500 hover:bg-brand-green/5 hover:text-brand-green hover:border-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight fontSize="small" />
        </button>

      </div>
    </div>
  );
}