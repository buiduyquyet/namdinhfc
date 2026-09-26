import Image from "next/image";

import { TEAM_NAME } from "@/data/matches";

interface TeamLogoProps {
  name: string;
  /** URL logo lấy từ collection Đội bóng. Bỏ trống thì hiện chữ viết tắt. */
  logo?: string;
  size?: number;
  /** Bỏ nền trắng + đổ bóng — dùng cho logo cỡ nhỏ trong bảng xếp hạng. */
  bare?: boolean;
}

/** Logo CLB có sẵn trong `public/`, dùng khi Nam Định chưa khai báo logo trong CMS. */
const CLUB_LOGO = "/main-logo.png";

/** Viết tắt tên đội khi chưa có logo: "Hà Nội FC" -> "HN". */
function getTeamInitials(name: string): string {
  if (name === TEAM_NAME) return "NĐ";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Logo một đội bóng, dùng chung cho thẻ trận đấu và bảng xếp hạng.
 * Nguồn ảnh là collection Đội bóng (ảnh upload hoặc "URL logo" ngoài).
 */
const TeamLogo = ({ name, logo, size = 44, bare = false }: TeamLogoProps) => {
  const isNamDinh = name === TEAM_NAME;
  const src = logo || (isNamDinh ? CLUB_LOGO : undefined);

  if (src) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 ${bare ? "" : "bg-white"}`}
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-heading font-extrabold shrink-0 ${
        isNamDinh
          ? `bg-primary text-secondary ${bare ? "" : "shadow-md"}`
          : `bg-linear-to-br from-gray-200 to-gray-300 text-gray-600 ${bare ? "" : "shadow-sm"}`
      }`}
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {getTeamInitials(name)}
    </div>
  );
};

export default TeamLogo;
