import { Match, TEAM_NAME } from "@/data/matches";

interface MatchCardProps {
  match: Match;
  variant?: "default" | "featured";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("vi-VN", options);
}

function TeamLogo({ name, size = 40 }: { name: string; size?: number }) {
  const isNamDinh = name === TEAM_NAME;
  const initials = isNamDinh
    ? "NĐ"
    : name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: isNamDinh
          ? "var(--color-primary)"
          : "linear-gradient(135deg, var(--color-gray-200), var(--color-gray-300))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isNamDinh ? "var(--color-secondary)" : "var(--color-gray-600)",
        fontFamily: "var(--font-heading)",
        fontWeight: 800,
        fontSize: `${size * 0.3}px`,
        flexShrink: 0,
        boxShadow: isNamDinh
          ? "0 2px 8px rgba(152, 197, 233, 0.3)"
          : "0 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      {initials}
    </div>
  );
}

const MatchCard = ({
  match,
  variant = "default",
}: MatchCardProps) => {
  const isFeatured = variant === "featured";
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";

  return (
    <div
      className={isFeatured ? "" : "card"}
      style={{
        padding: "16px 20px",
        borderRadius: "var(--radius-md)",
        background: isFeatured
          ? "linear-gradient(135deg, var(--color-secondary-dark), var(--color-secondary), var(--color-secondary-light))"
          : undefined,
        border: isFeatured ? "1px solid rgba(152, 197, 233, 0.15)" : undefined,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "white",
          margin: 0,
          paddingBottom: "20px",
        }}
      >
        Trận kế tiếp
      </h3>
      {/* Competition & Date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "3rem",
        }}
      >
        <span
          className={`badge ${isFeatured ? "" : "badge-primary"}`}
          style={
            isFeatured
              ? {
                  backgroundColor: "rgba(152, 197, 233, 0.15)",
                  color: "var(--color-primary)",
                }
              : {}
          }
        >
          {match.competition}
        </span>
        {/* {isLive && ( */}
        <span
          className="badge"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#EF4444",
            animation: "pulse-glow 2s infinite",
          }}
        >
          ● LIVE
        </span>
        {/* )} */}
        {isFinished && <span className="badge badge-success">Kết thúc</span>}
      </div>

      {/* Teams */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Home Team */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            flex: 1,
            minWidth: 0,
          }}
        >
          <TeamLogo name={match.homeTeam} size={isFeatured ? 56 : 44} />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: isFeatured ? "0.875rem" : "0.8125rem",
              color: isFeatured ? "white" : "var(--color-secondary)",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {match.homeTeam}
          </span>
        </div>

        {/* Score / Time */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
            flexShrink: 0,
          }}
        >
          {isFinished || isLive ? (
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: isFeatured ? "2.5rem" : "2rem",
                color: isFeatured ? "white" : "var(--color-secondary)",
                lineHeight: 1,
                letterSpacing: "0.05em",
              }}
            >
              {match.homeScore} - {match.awayScore}
            </div>
          ) : (
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: isFeatured ? "1.75rem" : "1.25rem",
                color: isFeatured
                  ? "var(--color-primary)"
                  : "var(--color-secondary)",
                lineHeight: 1,
              }}
            >
              {match.time}
            </div>
          )}
          <span
            style={{
              fontSize: "0.75rem",
              color: isFeatured
                ? "rgba(255,255,255,0.4)"
                : "var(--color-gray-400)",
              fontWeight: 500,
            }}
          >
            {isFinished ? "FT" : formatDate(match.date)}
          </span>
        </div>

        {/* Away Team */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            flex: 1,
            minWidth: 0,
          }}
        >
          <TeamLogo name={match.awayTeam} size={isFeatured ? 56 : 44} />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: isFeatured ? "0.875rem" : "0.8125rem",
              color: isFeatured ? "white" : "var(--color-secondary)",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Venue */}
      <div
        style={{
          marginTop: "2.25rem",
          textAlign: "center",
          fontSize: "0.8125rem",
          color: isFeatured
            ? "rgba(255,255,255,0.35)"
            : "var(--color-gray-400)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.375rem",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {match.venue}
        {match.matchday && (
          <>
            <span>•</span>
            <span>Vòng {match.matchday}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
