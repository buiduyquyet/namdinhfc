"use client";

import { LeagueTableEntry, TEAM_NAME } from "@/data/league-table";

interface LeagueTableProps {
  teams?: LeagueTableEntry[];
  showFullTable?: boolean;
  highlightedTeam?: string;
}

const formColors = {
  W: "#22c55e", // Green
  D: "#eab308", // Yellow
  L: "#ef4444", // Red
};

const LeagueTable = ({
  teams,
  showFullTable = false,
  highlightedTeam = TEAM_NAME,
}: LeagueTableProps) => {
  const displayTeams = showFullTable ? teams : teams?.slice(0, 4);

  return (
    <div 
      style={{
        background: "var(--color-white)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden",
        border: "2px solid var(--color-secondary)",
        height: "100%"
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--color-secondary-dark), var(--color-secondary), var(--color-secondary-light))",
          padding: "1rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}
        >
          Bảng Xếp Hạng
        </h3>
        <span
          className="hover:underline hover:text-primary cursor-pointer"
          style={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Xem tất cả {'>>'}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--color-gray-50)",
                borderBottom: "2px solid var(--color-gray-200)",
              }}
            >
              <th
                style={{
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-gray-500)",
                  textAlign: "center",
                  width: "40px",
                }}
              >
                #
              </th>
              <th
                style={{
                  padding: "0.75rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-gray-500)",
                  textAlign: "left",
                }}
              >
                Đội
              </th>
              <th
                style={{
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-gray-500)",
                  textAlign: "center",
                }}
              >
                ST
              </th>
              <th
                style={{
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-gray-500)",
                  textAlign: "center",
                }}
              >
                HS
              </th>
              <th
                style={{
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--color-secondary)",
                  textAlign: "center",
                }}
              >
                Đ
              </th>
              <th
                style={{
                  padding: "0.75rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-gray-500)",
                  textAlign: "center",
                }}
              >
                Phong độ
              </th>
            </tr>
          </thead>
          <tbody>
            {displayTeams?.map((team, index) => {
              const isHighlighted = team.team === highlightedTeam;
              return (
                <tr
                  key={team.position}
                  style={{
                    background: isHighlighted
                      ? "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))"
                      : index % 2 === 0
                      ? "white"
                      : "var(--color-gray-50)",
                    borderLeft: isHighlighted
                      ? "4px solid var(--color-primary)"
                      : "4px solid transparent",
                    transition: "background 0.2s ease",
                  }}
                >
                  <td
                    style={{
                      padding: "0.75rem 0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color:
                        team.position <= 3
                          ? "var(--color-primary)"
                          : "var(--color-gray-600)",
                      textAlign: "center",
                    }}
                  >
                    {team.position}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: isHighlighted ? 600 : 400,
                      color: isHighlighted
                        ? "var(--color-secondary)"
                        : "var(--color-gray-700)",
                    }}
                  >
                    {team.shortName}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--color-gray-600)",
                      textAlign: "center",
                    }}
                  >
                    {team.played}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--color-gray-600)",
                      textAlign: "center",
                    }}
                  >
                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--color-secondary)",
                      textAlign: "center",
                    }}
                  >
                    {team.points}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.75rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        justifyContent: "center",
                      }}
                    >
                      {team.form.slice(-5).map((result, i) => (
                        <span
                          key={i}
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "3px",
                            background: formColors[result],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.625rem",
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {/* <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid var(--color-gray-200)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "var(--color-gray-500)",
        }}
      >
        <span>Hiển thị top {displayTeams?.length} đội</span>
        <span style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                background: formColors.W,
                borderRadius: "2px",
              }}
            />
            Thắng
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                background: formColors.D,
                borderRadius: "2px",
              }}
            />
            Hòa
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                background: formColors.L,
                borderRadius: "2px",
              }}
            />
            Thua
          </span>
        </span>
      </div> */}
    </div>
  );
};

export default LeagueTable;
