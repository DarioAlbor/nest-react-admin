import { ChevronLeft, ChevronRight } from 'react-feather';

import { useTranslation } from '../../hooks/useTranslation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
}: PaginationProps) {
  const { t } = useTranslation();
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md border ${
              page === currentPage
                ? 'bg-urbano-primary text-white border-urbano-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="text-sm text-gray-600">
        {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
      </div>
    </div>
  );
}
