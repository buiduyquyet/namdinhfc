import Link from "next/link";
import type { ReactNode } from "react";

interface PanelCardProps {
  title: string;
  /** Dòng phụ dưới tiêu đề, ví dụ "Mùa 2026/27 · Sau vòng 2". */
  caption?: string;
  action?: { label: string; href: string };
  children: ReactNode;
}

/**
 * Khung thẻ có dải tiêu đề navy + thân trắng. Dùng cho các khối thông tin đặt cạnh nhau
 * (Trận kế tiếp, Bảng xếp hạng) để chúng chung một kiểu: bo góc, tiêu đề, link "Xem tất cả".
 */
const PanelCard = ({ title, caption, action, children }: PanelCardProps) => (
  <div className="card hover:transform-none h-full flex flex-col">
    <div className="flex items-center justify-between gap-3 min-h-18 px-5 py-3 bg-linear-to-r from-secondary to-secondary-light">
      <div className="min-w-0">
        <h3 className="m-0 font-heading font-bold text-lg text-white">{title}</h3>
        {caption && <p className="m-0 mt-0.5 text-xs text-white/75">{caption}</p>}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-1 shrink-0 text-sm font-semibold text-primary-light transition-colors hover:text-white"
        >
          {action.label}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </div>

    <div className="flex-1 flex flex-col">{children}</div>
  </div>
);

export default PanelCard;
