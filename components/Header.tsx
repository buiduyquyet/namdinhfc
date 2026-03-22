"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import DesktopNav from "@/components/DesktopNav";
import MobileMenu from "@/components/MobileMenu";

const NAV_ITEMS = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu", href: "/about" },
  { label: "Đội Hình", href: "/squad" },
  { label: "Lịch Thi Đấu", href: "/#lich-thi-dau" },
  { label: "Liên Hệ", href: "/#lien-he" },
];

const Header = () => {
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
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setIsMobileMenuOpen(false);

      // If it's a section link (starts with /#), smooth scroll on homepage
      if (href.startsWith("/#")) {
        const targetId = href.replace("/#", "");
        if (pathname === "/") {
          e.preventDefault();
          const element = document.getElementById(targetId);
          if (element) {
            const headerOffset = 80;
            const offsetPosition =
              element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }
        return;
      }

      // Scroll to top when clicking homepage link while already on homepage
      if (href === "/" && pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div style={{ width: "100%", maxWidth: "1280px", margin: "0 auto" }}>
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
          <DesktopNav
            items={NAV_ITEMS}
            isActive={isActive}
            pathname={pathname}
            onNavClick={handleNavClick}
          />

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
            {[
              isMobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              undefined,
              isMobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            ].map((transform, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "var(--color-primary)",
                  borderRadius: "2px",
                  transition: "all var(--transition-base)",
                  ...(transform !== undefined ? { transform } : {}),
                  ...(i === 1 ? { opacity: isMobileMenuOpen ? 0 : 1 } : {}),
                }}
              />
            ))}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <MobileMenu
          items={NAV_ITEMS}
          isActive={isActive}
          pathname={pathname}
          isScrolled={isScrolled}
          onNavClick={handleNavClick}
        />
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
};

export default Header;
