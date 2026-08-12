import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Đường dẫn gốc kèm sẵn query khác (nếu có), ví dụ `/news?category=tran-dau`. */
  basePath: string;
}

const ITEM_BASE =
  "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-full font-heading font-bold text-sm transition-colors";

/** Tạo href cho một trang, giữ nguyên các query đang có trên `basePath`. */
function pageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}`;
}

const Pagination = ({ page, totalPages, basePath }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 mt-12" aria-label="Phân trang">
      {page > 1 && (
        <Link href={pageHref(basePath, page - 1)} className={`${ITEM_BASE} bg-gray-100 text-gray-600 hover:bg-primary-50`}>
          ← Trước
        </Link>
      )}

      {pages.map((item) => (
        <Link
          key={item}
          href={pageHref(basePath, item)}
          aria-current={item === page ? "page" : undefined}
          className={`${ITEM_BASE} ${
            item === page
              ? "bg-secondary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-secondary"
          }`}
        >
          {item}
        </Link>
      ))}

      {page < totalPages && (
        <Link href={pageHref(basePath, page + 1)} className={`${ITEM_BASE} bg-gray-100 text-gray-600 hover:bg-primary-50`}>
          Sau →
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
