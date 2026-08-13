import Image from "next/image";

import { TEAM_NAME, type Match } from "@/data/matches";
import { formatWeekdayDate } from "@/lib/format-date";

interface MatchCardProps {
  match: Match;
  variant?: "default" | "featured";
  /** Tiêu đề nhỏ phía trên, chỉ dùng cho biến thể `featured`. */
  title?: string;
}

interface TeamLogoProps {
  name: string;
  logo?: string;
  size?: number;
}

/** Viết tắt tên đội khi chưa upload logo: "Hà Nội FC" -> "HN". */
function getInitials(name: string): string {
  if (name === TEAM_NAME) return "NĐ";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const TeamLogo = ({ name, logo, size = 44 }: TeamLogoProps) => {
  const isNamDinh = name === TEAM_NAME;

  if (logo) {
    return (
      <div
        className="relative rounded-full overflow-hidden bg-white/10 shrink-0"
        style={{ width: size, height: size }}
      >
        <Image src={logo} alt={name} fill sizes={`${size}px`} className="object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-heading font-extrabold shrink-0 ${
        isNamDinh
          ? "bg-primary text-secondary shadow-md"
          : "bg-linear-to-br from-gray-200 to-gray-300 text-gray-600 shadow-sm"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {getInitials(name)}
    </div>
  );
};

const STATUS_BADGE: Record<Match["status"], { label: string; className: string } | null> = {
  upcoming: null,
  live: { label: "● TRỰC TIẾP", className: "bg-red-50 text-red-500 animate-pulse" },
  finished: { label: "Kết thúc", className: "badge-success" },
  postponed: { label: "Bị hoãn", className: "bg-amber-50 text-amber-700" },
};

const MatchCard = ({ match, variant = "default", title }: MatchCardProps) => {
  const isFeatured = variant === "featured";
  const hasScore = match.status === "finished" || match.status === "live";
  const logoSize = isFeatured ? 56 : 44;
  const statusBadge = STATUS_BADGE[match.status];

  const textMain = isFeatured ? "text-white" : "text-secondary";
  const textMuted = isFeatured ? "text-white/40" : "text-gray-400";

  return (
    <div
      className={`h-full px-5 py-4 rounded-xl flex flex-col ${
        isFeatured
          ? "bg-linear-to-br from-secondary-dark via-secondary to-secondary-light border border-primary/15"
          : "card"
      }`}
    >
      {isFeatured && title && (
        <h3 className="font-heading font-bold text-xl text-white mb-5">{title}</h3>
      )}

      {/* Giải đấu & trạng thái */}
      <div className="flex items-center justify-between gap-2 mb-8">
        <span
          className={`badge ${isFeatured ? "bg-primary/15 text-primary" : "badge-primary"}`}
        >
          {match.competition}
        </span>
        {statusBadge && <span className={`badge ${statusBadge.className}`}>{statusBadge.label}</span>}
      </div>

      {/* Hai đội & tỉ số */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <TeamLogo name={match.homeTeam} logo={match.homeLogo} size={logoSize} />
          <span
            className={`font-heading font-bold text-center leading-tight ${textMain} ${
              isFeatured ? "text-sm" : "text-[0.8125rem]"
            }`}
          >
            {match.homeTeam}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          {hasScore ? (
            <div
              className={`font-heading font-black leading-none tracking-wider ${textMain} ${
                isFeatured ? "text-4xl" : "text-3xl"
              }`}
            >
              {match.homeScore ?? 0} - {match.awayScore ?? 0}
            </div>
          ) : (
            <div
              className={`font-heading font-extrabold leading-none ${
                isFeatured ? "text-3xl text-primary" : "text-xl text-secondary"
              }`}
            >
              {match.time}
            </div>
          )}
          <span className={`text-xs font-medium ${textMuted}`}>
            {match.status === "finished" ? "FT" : formatWeekdayDate(match.date)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <TeamLogo name={match.awayTeam} logo={match.awayLogo} size={logoSize} />
          <span
            className={`font-heading font-bold text-center leading-tight ${textMain} ${
              isFeatured ? "text-sm" : "text-[0.8125rem]"
            }`}
          >
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Sân & vòng đấu */}
      <div
        className={`mt-8 flex items-center justify-center gap-1.5 text-[0.8125rem] ${textMuted}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="truncate">{match.venue}</span>
        {match.matchday && (
          <>
            <span>•</span>
            <span className="shrink-0">Vòng {match.matchday}</span>
          </>
        )}
      </div>

      {/* Hành động */}
      {(match.ticketUrl || match.highlightUrl) && (
        <div className="mt-auto pt-5 flex justify-center gap-3">
          {match.ticketUrl && match.status !== "finished" && (
            <a
              href={match.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-xs px-5 py-2"
            >
              Mua Vé
            </a>
          )}
          {match.highlightUrl && match.status === "finished" && (
            <a
              href={match.highlightUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn text-xs px-5 py-2 ${isFeatured ? "btn-outline" : "btn-outline-dark"}`}
            >
              Xem Highlight
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchCard;
