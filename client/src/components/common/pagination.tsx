import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Trước
      </button>
      <span className="text-sm font-medium">
        Trang {currentPage} / {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
      >
        Tiếp
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};
