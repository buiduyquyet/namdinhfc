"use client";

import Link from "next/link";
import { clubInfo } from "@/data/club-info";

const QUICK_LINKS = [
    { label: "Trang Chủ", href: "/" },
    { label: "Giới Thiệu", href: "/about" },
    { label: "Đội Hình", href: "/squad" },
    { label: "Lịch Thi Đấu", href: "/fixtures" },
    { label: "Sân Thiên Trường", href: "/stadium" },
    { label: "Liên Hệ", href: "/contact" },
];

const SOCIAL_LINKS = [
    {
        label: "Facebook",
        href: clubInfo.facebook,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
];

const Footer = () => {
    return (
        <footer
            style={{
                backgroundColor: "var(--color-secondary)",
                color: "rgba(255, 255, 255, 0.6)",
                paddingTop: "4rem",
                paddingBottom: "0",
                position: "relative",
            }}
        >
            {/* Top accent line */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background:
                        "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
                }}
            />

            <div className="container">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "2.5rem",
                        paddingBottom: "3rem",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                    className="footer-grid"
                >
                    {/* Brand Column */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                marginBottom: "1.25rem",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: "var(--color-primary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--color-secondary)",
                                    fontFamily: "var(--font-heading)",
                                    fontWeight: 800,
                                    fontSize: "1rem",
                                }}
                            >
                                NĐ
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontWeight: 800,
                                        fontSize: "1.125rem",
                                        color: "white",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Thép Xanh Nam Định FC
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.8125rem",
                                        color: "var(--color-primary)",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Hào khí Đông A
                                </div>
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: "0.875rem",
                                lineHeight: 1.7,
                                color: "rgba(255, 255, 255, 0.45)",
                                maxWidth: "360px",
                            }}
                        >
                            Đội bóng thành Nam — Niềm tự hào của người dân Nam Định. Đương
                            kim vô địch V.League 1 với 2 lần liên tiếp đăng quang.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                color: "var(--color-primary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                marginBottom: "1.25rem",
                            }}
                        >
                            Liên Kết Nhanh
                        </h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href} style={{ marginBottom: "0.625rem" }}>
                                    <Link
                                        href={link.href}
                                        style={{
                                            fontSize: "0.875rem",
                                            color: "rgba(255, 255, 255, 0.5)",
                                            textDecoration: "none",
                                            transition: "color var(--transition-fast)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.color = "var(--color-primary)")
                                        }
                                        onMouseLeave={(e) =>
                                        (e.currentTarget.style.color =
                                            "rgba(255, 255, 255, 0.5)")
                                        }
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                color: "var(--color-primary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                marginBottom: "1.25rem",
                            }}
                        >
                            Liên Hệ
                        </h4>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                                fontSize: "0.875rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.625rem",
                                    alignItems: "flex-start",
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="2"
                                    style={{ flexShrink: 0, marginTop: "2px" }}
                                >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                                    {clubInfo.address}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.625rem",
                                    alignItems: "center",
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="2"
                                    style={{ flexShrink: 0 }}
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                                    {clubInfo.phone}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.625rem",
                                    alignItems: "center",
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="2"
                                    style={{ flexShrink: 0 }}
                                >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                                    {clubInfo.email}
                                </span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div
                            style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}
                        >
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(152, 197, 233, 0.08)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "rgba(255, 255, 255, 0.5)",
                                        transition: "all var(--transition-fast)",
                                        border: "1px solid rgba(152, 197, 233, 0.12)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "var(--color-primary)";
                                        e.currentTarget.style.color = "var(--color-secondary)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.borderColor = "var(--color-primary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "rgba(152, 197, 233, 0.08)";
                                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(152, 197, 233, 0.12)";
                                    }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div
                    style={{
                        padding: "1.5rem 0",
                        textAlign: "center",
                        fontSize: "0.8125rem",
                        color: "rgba(255, 255, 255, 0.3)",
                    }}
                >
                    © {new Date().getFullYear()} Thép Xanh Nam Định FC. All rights
                    reserved.
                </div>
            </div>

            <style jsx global>{`
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr !important;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
