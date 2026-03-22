"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

const NAV_ITEMS = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu", href: "/about" },
  { label: "Đội Hình", href: "/squad" },
  { label: "Lịch Thi Đấu", href: "/#lich-thi-dau" },
  { label: "Liên Hệ", href: "/#lien-he" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActive, setIsActive] = useState(pathname);

  useEffect(() => {
    setIsActive(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setIsMobileMenuOpen(false);

      // If it's a section link (starts with /#)
      if (href.startsWith("/#")) {
        const targetId = href.replace("/#", "");

        if (pathname === "/") {
          e.preventDefault();
          const element = document.getElementById(targetId);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
        // If not on homepage, let the Link navigate normally to /#id
        return;
      }

      // Special case for scrolling to top on homepage
      if (href === "/" && pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    },
    [pathname]
  );

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all var(--transition-base)",
        backgroundColor: "var(--color-primary-dark)",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        boxShadow: isScrolled ? "0 2px 12px rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px",
            transition: "height var(--transition-base)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "#trang-chu")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Image
              width={65}
              height={65}
              src="/main-logo.jpg"
              className="rounded-full"
              alt="main-logo-namdinhfc"
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.625rem",
                  color: "var(--color-primary)",
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Thép Xanh
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "0.9375rem",
                  color: "var(--color-white)",
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                Nam Định FC
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
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
            {NAV_ITEMS.map((item) => {
              const isCurrentActive = isActive === item.href || (item.href === "/" && pathname === "/") || (item.href.startsWith("/#") && pathname === "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "44px",
              height: "44px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "var(--radius-sm)",
              transition: "background var(--transition-fast)",
              gap: "5px",
            }}
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                backgroundColor: "var(--color-primary)",
                borderRadius: "2px",
                transition: "all var(--transition-base)",
                transform: isMobileMenuOpen
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                backgroundColor: "var(--color-primary)",
                borderRadius: "2px",
                transition: "all var(--transition-base)",
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                backgroundColor: "var(--color-primary)",
                borderRadius: "2px",
                transition: "all var(--transition-base)",
                transform: isMobileMenuOpen
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            />
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
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
            {NAV_ITEMS.map((item, index) => {
              const isCurrentActive = isActive === item.href || (item.href === "/" && pathname === "/") || (item.href.startsWith("/#") && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
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
      )}

      <style jsx global>{`
        .desktop-nav {
          display: none !important;
        }
        .mobile-menu-btn {
          display: flex !important;
        }
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
