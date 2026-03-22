import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  items: NavItem[];
  isActive: string;
  pathname: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const DesktopNav = ({ items, isActive, pathname, onNavClick }: DesktopNavProps) => (
  <ul
    style={{
      display: "none",
      listStyle: "none",
      gap: "0.125rem",
      margin: 0,
      padding: 0,
    }}
    className="desktop-nav"
  >
    {items.map((item) => {
      const isCurrentActive =
        isActive === item.href ||
        (item.href === "/" && pathname === "/") ||
        (item.href.startsWith("/#") && pathname === "/");
      return (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={(e) => onNavClick(e, item.href)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.5rem 0.875rem",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: isCurrentActive
                ? "var(--color-secondary)"
                : "var(--color-white)",
              backgroundColor: isCurrentActive
                ? "var(--color-primary-light)"
                : "transparent",
              textDecoration: "none",
              borderRadius: "var(--radius-full)",
              transition: "all var(--transition-fast)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            {item.label}
          </Link>
        </li>
      );
    })}
  </ul>
);

export default DesktopNav;
