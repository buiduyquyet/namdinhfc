import { Fragment } from "react";

import { type LeagueTableEntry, type MatchResult, TEAM_NAME } from "@/data/league-table";
import { LETTER_BY_RESULT, RESULT_LABEL } from "@/lib/league-form";

interface LeagueTableProps {
  teams: LeagueTableEntry[];
  /** Số dòng hiển thị ở bản rút gọn. Bỏ trống để hiện toàn bộ bảng. */
  limit?: number;
  highlightedTeam?: string;
}

const FORM_COLOR: Record<MatchResult, string> = {
  W: "bg-(--color-success)",
  D: "bg-(--color-accent)",
  L: "bg-(--color-danger)",
};

/**
 * Bản rút gọn luôn chứa đội được highlight: nếu đội nằm ngoài top `limit`,
 * lấy top `limit - 1` rồi nối thêm dòng của đội đó.
 */
function pickRows(teams: LeagueTableEntry[], limit: number | undefined, highlightedTeam: string) {
  if (!limit || teams.length <= limit) return teams;

  const top = teams.slice(0, limit);
  if (top.some((team) => team.team === highlightedTeam)) return top;

  const highlighted = teams.find((team) => team.team === highlightedTeam);
  return highlighted ? [...teams.slice(0, limit - 1), highlighted] : top;
}

// Chỉ chứa thuộc tính không bị ghi đè ở từng ô, tránh 2 class Tailwind cùng thuộc tính
const HEAD_CELL = "py-3 text-xs";
const HEAD_MUTED = `${HEAD_CELL} px-2 text-center font-semibold text-gray-500`;
const BODY_CELL = "py-3 text-sm";
const BODY_STAT = `${BODY_CELL} px-2 text-center text-gray-600`;

const LeagueTable = ({ teams, limit, highlightedTeam = TEAM_NAME }: LeagueTableProps) => {
  const rows = pickRows(teams, limit, highlightedTeam);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th scope="col" className={`${HEAD_MUTED} w-10`}>#</th>
            <th scope="col" className={`${HEAD_CELL} px-3 text-left font-semibold text-gray-500`}>
              Đội
            </th>
            <th scope="col" className={HEAD_MUTED} title="Số trận">ST</th>
            <th scope="col" className={HEAD_MUTED} title="Hiệu số">HS</th>
            <th scope="col" className={`${HEAD_CELL} px-2 text-center font-bold text-secondary`} title="Điểm">
              Đ
            </th>
            <th scope="col" className={`${HEAD_MUTED} hidden sm:table-cell`}>Phong độ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((team, index) => {
            const isHighlighted = team.team === highlightedTeam;
            // Dòng đội nhà bị tách khỏi nhóm đầu bảng → chèn dòng "⋯" báo có đội bị ẩn
            const isDetached = index > 0 && team.position !== rows[index - 1].position + 1;

            return (
              <Fragment key={team.team}>
                {isDetached && (
                  <tr aria-hidden="true" className="border-b border-gray-100">
                    <td colSpan={6} className="py-1 text-center text-xs leading-none text-gray-400">
                      ⋯
                    </td>
                  </tr>
                )}
                <tr
                  className={`border-b border-gray-100 last:border-b-0 ${
                    isHighlighted
                      ? "bg-primary-50 shadow-[inset_4px_0_0_var(--color-primary)]"
                      : index % 2 === 1
                        ? "bg-gray-50/60"
                        : "bg-white"
                  }`}
                >
                  <td
                    className={`${BODY_CELL} px-2 text-center font-semibold ${
                      team.position <= 3 ? "text-primary" : "text-gray-600"
                    }`}
                  >
                    {team.position}
                  </td>
                  <td
                    className={`${BODY_CELL} px-3 text-left ${
                      isHighlighted ? "font-bold text-secondary" : "text-gray-700"
                    }`}
                  >
                    {team.shortName}
                  </td>
                  <td className={BODY_STAT}>{team.played}</td>
                  <td className={BODY_STAT}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                  <td className={`${BODY_CELL} px-2 text-center font-bold text-secondary`}>
                    {team.points}
                  </td>
                  <td className={`${BODY_STAT} hidden sm:table-cell`}>
                    <div className="flex justify-center gap-1">
                      {team.form.map((result, i) => (
                        <span
                          key={i}
                          title={RESULT_LABEL[result]}
                          className={`flex items-center justify-center size-4.5 rounded-[3px] text-[0.625rem] font-bold text-white ${FORM_COLOR[result]}`}
                        >
                          {LETTER_BY_RESULT[result]}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
