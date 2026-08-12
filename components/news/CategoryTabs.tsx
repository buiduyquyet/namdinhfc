import Link from "next/link";

import { NEWS_CATEGORY_OPTIONS, type NewsCategory } from "@/lib/news-category";

interface CategoryTabsProps {
  active?: NewsCategory;
}

const TAB_BASE =
  "inline-flex items-center px-4 py-2 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-colors";

const CategoryTabs = ({ active }: CategoryTabsProps) => {
  const tabs = [{ label: "Tất cả", value: undefined }, ...NEWS_CATEGORY_OPTIONS];

  return (
    <nav className="flex flex-wrap justify-center gap-2 mb-10">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.label}
            href={tab.value ? `/news?category=${tab.value}` : "/news"}
            aria-current={isActive ? "page" : undefined}
            className={`${TAB_BASE} ${
              isActive
                ? "bg-secondary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-secondary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default CategoryTabs;
