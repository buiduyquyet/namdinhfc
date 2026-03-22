import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  items: NavItem[];
  isActive: string;
  pathname: string;
  isScrolled: boolean;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const MobileMenu = ({ items, isActive, pathname, isScrolled, onNavClick }: MobileMenuProps) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      top: isScrolled ? "63px" : "75px",
      backgroundColor: "var(--color-secondary)",
      zIndex: 999,
      animation: "fadeIn 0.2s ease-out",
    }}
  >
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem",
        gap: "0.125rem",
      }}
    >
      {items.map((item, index) => {
        const isCurrentActive =
          isActive === item.href ||
          (item.href === "/" && pathname === "/") ||
          (item.href.startsWith("/#") && pathname === "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => onNavClick(e, item.href)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1rem 1.25rem",
              fontFamily: "var(--font-heading)",
              fontWeight: isCurrentActive ? 700 : 500,
              fontSize: "1rem",
              color: isCurrentActive
                ? "var(--color-primary)"
                : "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
              borderRadius: "var(--radius-md)",
              backgroundColor: isCurrentActive
                ? "rgba(152, 197, 233, 0.1)"
                : "transparent",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  </div>
);

export default MobileMenu;
