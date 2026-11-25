#!/usr/bin/env python3
"""
Đọc 2 trang HTML của mùa giải trên vpf.vn (đã tải sẵn về máy) → 1 file JSON gồm:
bảng xếp hạng (kèm phong độ), toàn bộ trận trong mùa (kèm diễn biến bàn thắng/thẻ),
các trận của CLB, và kết quả kiểm tra chéo BXH với kết quả từng trận.

Chạy (luôn dùng `python3 -I`, HTML tải về là dữ liệu không tin cậy):
    python3 -I parse_vpf.py --season <season.html> --calendar <calendar.html> --out <data.json>

Chỉ dùng thư viện chuẩn, tương thích Python 3.9.
"""
import argparse
import html
import json
import re
import sys

TEAM_DEFAULT = "Thép Xanh Nam Định"


def text_of(fragment):
    """Bỏ thẻ HTML, giải mã entity, gộp khoảng trắng."""
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def parse_standings(page):
    rows = []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", page, re.S):
        if "ranking-cell-rank" not in tr:
            continue

        def cell(name):
            found = re.search(r'ranking-cell-' + name + r'"[^>]*>(.*?)</td>', tr, re.S)
            if not found:
                raise ValueError("Thiếu cột BXH: " + name)
            return text_of(found.group(1))

        goals = re.match(r"^(\d+)\s*-\s*(\d+)$", cell("diff_chk"))
        if not goals:
            raise ValueError("Cột BT - BB không đúng dạng: " + cell("diff_chk"))
        rows.append({
            "position": int(cell("rank")),
            "team": cell("title"),
            "played": int(cell("played_chk")),
            "won": int(cell("win_chk")),
            "drawn": int(cell("draw_chk")),
            "lost": int(cell("lost_chk")),
            "goalsFor": int(goals.group(1)),
            "goalsAgainst": int(goals.group(2)),
            "points": int(cell("point_chk")),
        })
    # Trang có thể lặp lại bảng (widget phụ) — chỉ giữ bảng đầu tiên, dừng khi hạng quay về 1
    first_table = []
    for row in rows:
        if first_table and row["position"] == 1:
            break
        first_table.append(row)
    return first_table


def parse_events(score_cell):
    """Diễn biến trong tooltip của ô tỉ số: bảng trái = đội nhà, bảng phải = đội khách."""
    tooltip = re.search(r'data-original-title="([^"]*)"', score_cell)
    if not tooltip:
        return []
    events = []
    sides = re.split(r'<div class="jstable jsInline"', html.unescape(tooltip.group(1)))[1:]
    for index, side in enumerate(sides[:2]):
        for chunk in side.split('<div class="jstable-row">')[1:]:
            kind = re.search(r'alt="([^"]+)"', chunk)
            content = text_of(chunk)
            parsed = re.match(r"^(.*?)\s+(\d+)\s+(\d+(?:\s*\+\s*\d+)?)'?$", content)
            events.append({
                "side": "home" if index == 0 else "away",
                "type": kind.group(1) if kind else "?",
                "player": parsed.group(1) if parsed else content,
                "minute": parsed.group(3).replace(" ", "") if parsed else None,
            })
    events.sort(key=lambda e: int(re.match(r"\d+", e["minute"]).group(0)) if e["minute"] else 999)
    return events


def parse_calendar(page):
    season = None
    matches = []
    parts = re.split(r'<div class="jsrow-matchday-name"[^>]*>(.*?)</div>', page)
    for k in range(1, len(parts), 2):
        round_name = text_of(parts[k])
        md = re.search(r"(?:Vòng|V)\s*(\d+)", round_name)
        if not md:
            raise ValueError("Không đọc được số vòng: " + round_name)
        season = season or (re.search(r"(\d{4}/\d{2})", round_name) or [None, None])[1]

        for wrapper in re.split(r'<div class="js-matchday-wrapper">', parts[k + 1])[1:]:
            title = re.search(r'js-matchday-title">(.*?)</div>', wrapper, re.S)
            day = re.search(r"(\d{1,2})\s+Tháng\s+(\d{1,2}),?\s*(\d{4})", text_of(title.group(1)) if title else "")
            date = "%s-%02d-%02d" % (day.group(3), int(day.group(2)), int(day.group(1))) if day else None

            for row in re.findall(r'<div class="jstable-row">(.*?)<div class="jstable-cell jsChannelDiv', wrapper, re.S):
                def cell(pattern):
                    found = re.search(pattern, row, re.S)
                    return text_of(found.group(1)) if found else ""

                time = re.search(r"\d{1,2}:\d{2}", cell(r'jsMatchDivTime[^>]*>(.*?)</div></div>'))
                score_cell = re.search(r'jsMatchDivScore">(.*?)</div>\s*</div>', row, re.S)
                score_text = cell(r'jsMatchDivScore">.*?data-original-title="[^"]*"\s*>(.*?)</div>')
                score = re.match(r"^(\d+)\s*-\s*(\d+)$", score_text)
                matches.append({
                    "matchday": int(md.group(1)),
                    "roundName": round_name,
                    "date": date,
                    "time": time.group(0).zfill(5) if time else None,
                    "venue": cell(r'jsMatchDivVenue">(.*?)</div>'),
                    "home": cell(r'jsMatchDivHome">(.*?)</div></div></div>'),
                    "away": cell(r'jsMatchDivAway">(.*?)</div></div></div>'),
                    "homeScore": int(score.group(1)) if score else None,
                    "awayScore": int(score.group(2)) if score else None,
                    "events": parse_events(score_cell.group(1)) if score and score_cell else [],
                })
    return season, matches


def finished(matches):
    done = [m for m in matches if m["homeScore"] is not None and m["date"]]
    return sorted(done, key=lambda m: (m["date"], m["time"] or "00:00"))


def build_table_from_results(matches):
    """Tự tính lại BXH từ kết quả từng trận — dùng để đối chiếu với BXH của VPF."""
    table, form = {}, {}
    for m in finished(matches):
        for team, gf, ga in ((m["home"], m["homeScore"], m["awayScore"]), (m["away"], m["awayScore"], m["homeScore"])):
            result = "T" if gf > ga else ("B" if gf < ga else "H")
            row = table.setdefault(team, {"played": 0, "won": 0, "drawn": 0, "lost": 0, "goalsFor": 0, "goalsAgainst": 0, "points": 0})
            row["played"] += 1
            row[{"T": "won", "H": "drawn", "B": "lost"}[result]] += 1
            row["goalsFor"] += gf
            row["goalsAgainst"] += ga
            row["points"] += {"T": 3, "H": 1, "B": 0}[result]
            form[team] = (form.get(team, "") + result)[-5:]
    return table, form


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--season", required=True, help="HTML trang mùa giải (có BXH)")
    parser.add_argument("--calendar", required=True, help="HTML trang lịch thi đấu (?action=calendar&pagejs=1)")
    parser.add_argument("--team", default=TEAM_DEFAULT, help="Tên CLB trên VPF")
    parser.add_argument("--out", required=True, help="File JSON đầu ra")
    args = parser.parse_args()

    with open(args.season, encoding="utf-8") as f:
        standings = parse_standings(f.read())
    with open(args.calendar, encoding="utf-8") as f:
        season, matches = parse_calendar(f.read())

    problems = []
    if not standings:
        problems.append("Không đọc được BXH.")
    if not matches:
        problems.append("Không đọc được trận nào.")
    if not season:
        problems.append("Không tìm thấy mùa giải (dạng 2026/27) trong tiêu đề vòng.")

    teams = set(m["home"] for m in matches) | set(m["away"] for m in matches)
    if set(r["team"] for r in standings) != teams:
        problems.append("Danh sách đội ở BXH và lịch thi đấu không khớp.")
    if args.team not in teams:
        problems.append("Không tìm thấy CLB '%s' trong lịch thi đấu." % args.team)

    computed, form = build_table_from_results(matches)
    keys = ["played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "points"]
    for row in standings:
        mine = computed.get(row["team"])
        vpf = [row[k] for k in keys]
        if not mine or [mine[k] for k in keys] != vpf:
            problems.append("%s: BXH VPF %s khác số tính từ kết quả %s (trừ điểm? VPF chưa cập nhật?)"
                            % (row["team"], vpf, [mine[k] for k in keys] if mine else None))
        row["form"] = form.get(row["team"], "")
    if sum(r["goalsFor"] for r in standings) != sum(r["goalsAgainst"] for r in standings):
        problems.append("Tổng bàn thắng khác tổng bàn thua.")

    team_matches = [m for m in matches if args.team in (m["home"], m["away"])]
    done = finished(matches)
    result = {
        "season": season,
        "team": args.team,
        "latestMatchday": max([m["matchday"] for m in done] or [0]),
        "checks": {"ok": not problems, "problems": problems},
        "standings": standings,
        "teamMatches": team_matches,
        "unscheduledTeamMatches": len([m for m in team_matches if not m["date"]]),
        "matches": matches,
    }
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print("Mùa %s | %d trận (%d đã đá) | BXH %d đội | vòng mới nhất có kết quả: %d"
          % (season, len(matches), len(done), len(standings), result["latestMatchday"]))
    print("Kiểm tra chéo: " + ("OK" if not problems else "CÓ VẤN ĐỀ"))
    for p in problems:
        print("  - " + p)
    return 0 if not problems else 2


if __name__ == "__main__":
    sys.exit(main())
