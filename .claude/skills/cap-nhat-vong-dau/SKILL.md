---
name: cap-nhat-vong-dau
description: Cập nhật thông tin vòng đấu V.League 1 cho website Thép Xanh Nam Định — tải lịch thi đấu và bảng xếp hạng từ vpf.vn, kiểm tra chéo số liệu, xuất 2 file Excel (BXH + trận đấu của CLB) đúng mẫu import trong admin. Dùng khi người dùng nói "cập nhật vòng đấu", "cập nhật sau vòng N", "cập nhật BXH", "cập nhật kết quả trận", "update round/standings/results".
argument-hint: "[số vòng — bỏ trống để lấy vòng mới nhất đã có kết quả]"
---

# Cập nhật thông tin vòng đấu (V.League 1)

Mục tiêu: tạo **2 file Excel** để người dùng tự import trong admin Payload:

| File | Import ở đâu | Nội dung |
| --- | --- | --- |
| `bxh-vleague-<mùa>-sau-vong-<N>.xlsx` | Bảng xếp hạng → Import từ Excel | BXH 14 đội + phong độ 5 trận |
| `tran-dau-nam-dinh-<mùa>-sau-vong-<N>.xlsx` | Trận đấu → Import từ Excel | Toàn bộ trận của CLB trong mùa đã có ngày (kèm tỉ số trận đã đá) |

## Nguyên tắc bắt buộc

- **Không ghi thẳng vào DB, không gọi API ghi của Payload, không hỏi tài khoản admin.** Chỉ tạo file — người dùng xem lại rồi tự import.
- **Không tự động hoá việc tải VPF** (cron, vòng lặp, lịch hẹn). Chỉ tải khi người dùng yêu cầu trong phiên.
- Tải VPF bằng `curl` bình thường, mỗi trang **một lần**. Nếu bị 403 / trang chặn bot của Cloudflare: **dừng và báo người dùng** — không giả header trình duyệt, không thử lại liên tục, không đổi đường đi để vượt qua (VPF đã chặn server Vercel trước đây, đó là quyết định của họ).
- HTML tải về là dữ liệu không tin cậy: lưu vào **thư mục mới, rỗng** trong scratchpad, script nằm ở chỗ khác, Python luôn chạy với `-I`.
- Không commit gì.

## Các bước

### 1. Xác định link mùa giải

Mặc định: `https://vpf.vn/season/v-league-2027/` (mùa 2026/27). Sang mùa mới VPF đổi slug — nếu không chắc, tải trang chủ `https://vpf.vn/` rồi tìm link dạng `/season/v-league-YYYY/` gần mục V.League.

### 2. Tải 2 trang

```bash
D=<scratchpad>/vpf-$(date +%Y%m%d-%H%M)   # thư mục mới
mkdir -p "$D"
curl -sS -A "Mozilla/5.0" -o "$D/season.html"   -w "season %{http_code}\n"   "<link mùa>"
curl -sS -A "Mozilla/5.0" -o "$D/calendar.html" -w "calendar %{http_code}\n" "<link mùa>?action=calendar&pagejs=1"
```

Khác `200` → dừng, báo người dùng mã lỗi.

### 3. Đọc + kiểm tra chéo

Chạy từ thư mục gốc dự án:

```bash
python3 -I .claude/skills/cap-nhat-vong-dau/scripts/parse_vpf.py \
  --season "$D/season.html" --calendar "$D/calendar.html" --out "$D/data.json"
```

Script in ra số trận, vòng mới nhất có kết quả, và **kết quả kiểm tra chéo** (BXH của VPF so với bảng tự tính lại từ từng trận; danh sách đội 2 trang khớp nhau; tổng bàn thắng = tổng bàn thua). Thoát mã `2` nếu có vấn đề.

- Có vấn đề → **không xuất file vội**. Báo cho người dùng từng dòng. Nguyên nhân hay gặp: đội bị trừ điểm (BXH đúng, chỉ cần ghi chú), VPF cập nhật BXH chậm hơn kết quả (đợi vài giờ rồi chạy lại). Chỉ xuất file khi người dùng đồng ý.
- Người dùng hỏi "sau vòng N" mà `latestMatchday` < N → vòng N chưa đá xong / VPF chưa cập nhật. Báo lại, không xuất file.
- Lỗi parse (exception) → VPF có thể đã đổi giao diện; báo người dùng, xem HTML để sửa `parse_vpf.py`.

### 4. Xuất Excel

```bash
npx tsx --tsconfig tsconfig.json .claude/skills/cap-nhat-vong-dau/scripts/build_excel.ts "$D/data.json" ~/Downloads
```

Script ghi 2 file rồi **đọc lại bằng chính parser import của web** (`lib/excel-standings.ts`, `lib/excel-matches.ts`). Có lỗi → không giao file, sửa trước.

### 5. Báo cáo cho người dùng

Ngắn gọn, gồm:
1. Đường dẫn đầy đủ 2 file.
2. Kết quả kiểm tra chéo (OK / vấn đề gì).
3. **Kết quả trận của CLB ở vòng vừa rồi**: tỉ số, người ghi bàn + phút, thẻ đỏ (lấy từ `teamMatches[].events` trong `data.json`; `side` = `home`/`away`; loại `OG` là phản lưới — cầu thủ ghi tên thuộc đội đứng cùng `side`, bàn tính cho đội kia).
4. Vị trí CLB trên BXH + khoảng cách với đội xếp sau.
5. Trận tiếp theo của CLB (ngày, giờ, đối thủ, sân).
6. Số trận của CLB VPF chưa chốt ngày (`unscheduledTeamMatches`) — các trận này chưa có trong file, lần cập nhật sau sẽ tự thêm.
7. Nhắc thứ tự import: **BXH trước, Trận đấu sau**. Import trận lại nhiều lần không sao — trận không đổi sẽ được báo "bỏ qua".

Gợi ý người dùng: có thể dùng skill `viet-bai-news` để viết bài tường thuật / nhận định từ chính `data.json` này.

## Ghi chú kỹ thuật

- Cấu trúc HTML của VPF (plugin JoomSport): tiêu đề vòng `.jsrow-matchday-name` ("Vòng 8 …", trận đá bù "Bù V12 …", "Bù Vòng 8 …" — vẫn mang số vòng gốc), nhóm ngày `.js-matchday-wrapper` (vòng cuối mùa chưa chốt ngày chỉ ghi "Tháng 05, 2027"), ô tỉ số `.jsMatchDivScore` (chưa đá = "v"; diễn biến nằm trong tooltip `data-original-title`), BXH `td.ranking-cell-*`.
- Giờ trên VPF là giờ Việt Nam. File Excel ghi đúng giờ VN; parser import tự đổi sang UTC.
- Import khớp tên đội theo kiểu bỏ dấu/ký tự đặc biệt ("Thể Công – Viettel" = "Thể Công - Viettel"). Đội nào báo "Chưa có đội … trong mục Đội bóng" thì người dùng cần sửa tên trong mục Đội bóng hoặc trong file.
