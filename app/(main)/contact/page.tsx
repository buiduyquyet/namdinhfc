import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import { clubInfo, leadership } from "@/data/club-info";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description: `Thông tin liên hệ chính thức của ${clubInfo.fullName} — địa chỉ ${clubInfo.stadium}, điện thoại ${clubInfo.phone}, email ${clubInfo.email}.`,
};

const AddressIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const MailIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" />
  </svg>
);

const FacebookIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface ContactChannel {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

const CONTACT_CHANNELS: ContactChannel[] = [
  {
    icon: AddressIcon,
    label: "Địa chỉ",
    value: clubInfo.address,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clubInfo.stadium)}`,
    external: true,
  },
  {
    icon: PhoneIcon,
    label: "Điện thoại",
    value: clubInfo.phone,
    href: `tel:${clubInfo.phone.replace(/[^\d+]/g, "")}`,
  },
  {
    icon: MailIcon,
    label: "Email",
    value: clubInfo.email,
    href: `mailto:${clubInfo.email}`,
  },
  {
    icon: FacebookIcon,
    label: "Fanpage chính thức",
    value: "facebook.com/ThepXanhNamDinhFC",
    href: clubInfo.facebook,
    external: true,
  },
];

const ContactCard = ({ icon, label, value, href, external }: ContactChannel) => {
  const content = (
    <div className="card h-full p-6 flex items-start gap-4">
      <span className="shrink-0 w-12 h-12 rounded-full bg-primary-50 text-primary flex items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-1.5">
          {label}
        </p>
        <p className="text-secondary font-medium leading-relaxed break-words">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block h-full"
    >
      {content}
    </a>
  );
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Liên Hệ"
        subtitle="Mọi thắc mắc về câu lạc bộ, vé trận đấu và hợp tác truyền thông"
        breadcrumbs={[{ label: "Liên Hệ", href: "/contact" }]}
      />

      {/* Kênh liên hệ */}
      <section className="section">
        <div className="container">
          <SectionTitle
            title="Thông Tin Liên Hệ"
            subtitle={`Văn phòng câu lạc bộ đặt tại ${clubInfo.stadium}, làm việc từ Thứ Hai đến Thứ Sáu.`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {CONTACT_CHANNELS.map((channel) => (
              <ContactCard key={channel.label} {...channel} />
            ))}
          </div>
        </div>
      </section>

      {/* Ban lãnh đạo */}
      <section className="section-alt">
        <div className="container">
          <SectionTitle
            title="Ban Lãnh Đạo"
            subtitle="Những người dẫn dắt Thép Xanh Nam Định"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            {leadership.map((member) => (
              <div key={member.name} className="card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary text-primary font-heading font-extrabold text-xl flex items-center justify-center">
                  {member.name.charAt(0)}
                </div>
                <p className="font-heading font-extrabold text-lg text-secondary uppercase tracking-tight">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-secondary text-center relative overflow-hidden">
        <div className="container relative z-10">
          <h2 className="font-heading font-extrabold uppercase text-white text-3xl md:text-4xl mb-4">
            Đồng Hành Cùng Đội Bóng Thành Nam
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Theo dõi fanpage chính thức để cập nhật nhanh nhất tin tức, lịch thi đấu và
            thông tin bán vé của câu lạc bộ.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={clubInfo.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Ghé Thăm Fanpage
            </a>
            <Link href="/about" className="btn btn-outline">
              Về Câu Lạc Bộ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
