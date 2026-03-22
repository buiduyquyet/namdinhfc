import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Thép Xanh Nam Định FC | Đương Kim Vô Địch V.League",
    template: "%s | Thép Xanh Nam Định FC",
  },
  description:
    "Website chính thức CLB Bóng đá Thép Xanh Nam Định — Đương kim vô địch V.League 1. Cập nhật lịch thi đấu, đội hình, tin tức và thông tin về Chảo lửa Thiên Trường.",
  keywords: [
    "Thép Xanh Nam Định",
    "Nam Định FC",
    "V.League",
    "bóng đá Việt Nam",
    "sân Thiên Trường",
  ],
  openGraph: {
    title: "Thép Xanh Nam Định FC",
    description:
      "Đương kim vô địch V.League 1 — Hào khí Đông A, niềm tự hào thành Nam.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${montserrat.variable} ${inter.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
