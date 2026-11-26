---
name: viet-bai-news
description: Viết bài tin tức cho mục News của website Thép Xanh Nam Định — tường thuật trận đấu, nhận định trước trận, tin cầu thủ/CLB (đề cử giải thưởng, chuyển nhượng, cộng đồng). Tự tìm và xác minh thông tin trên internet + dữ liệu VPF, trả về bài đúng các trường của collection News. Dùng khi người dùng nói "viết bài", "viết tin", "bài news", "tường thuật", "nhận định trận", "write a news article".
argument-hint: "[chủ đề — VD: tường thuật vòng 9 | nhận định vòng 10 | Xuân Son đề cử QBV châu Á]"
---

# Viết bài đăng mục News

Người đọc: **người hâm mộ đọc trang Tin tức của CLB**. Giọng văn: báo thể thao tiếng Việt, đứng về phía CLB nhưng không bịa, không phóng đại.

Kết quả giao cho người dùng là **văn bản để dán vào admin** (không ghi vào DB, không tạo file trừ khi được yêu cầu). Mở đầu tin nhắn giao bài bằng 1 dòng: `Viết cho: người hâm mộ đọc mục Tin tức trên website CLB (bro dán vào admin).`

## Trường của collection News (`collections/News.ts`)

| Trường | Ghi chú |
| --- | --- |
| Tiêu đề | Ngắn, có thông tin chính (tỉ số, đối thủ, sự kiện) |
| Tóm tắt | **Tối đa 300 ký tự** — đếm lại trước khi giao |
| Nội dung | Rich text: tiêu đề phụ in đậm, đoạn văn, danh sách gạch đầu dòng. Không dùng bảng (dán vào Lexical dễ vỡ) |
| Chuyên mục | Lấy từ `lib/news-category.ts`: Tin đội bóng · Trận đấu · Chuyển nhượng · Cộng đồng |
| Ảnh bìa | **Bắt buộc** — luôn nhắc người dùng dùng ảnh của CLB; ảnh trên vpf.vn/báo chí có bản quyền |
| Ngày đăng | Nhắc nếu bài có hạn (VD: nhận định phải đăng trước giờ bóng lăn) |

## Quy trình

### 1. Xác định loại bài và thu thập dữ liệu

**Bài về trận đấu (tường thuật / nhận định)** — nguồn chính là VPF:
- Chạy các bước 1–3 của skill `cap-nhat-vong-dau` (tải 2 trang VPF + `parse_vpf.py`) để có `data.json`: tỉ số, người ghi bàn + phút, thẻ, BXH, phong độ, lịch các trận. Đã có `data.json` mới trong phiên thì dùng lại.
- Diễn biến trong `events`: `side` = `home`/`away`; `OG` = phản lưới (cầu thủ thuộc đội `side`, bàn tính cho đội kia); `[GDKT]` trước tên = Giám đốc kỹ thuật.
- Bài tổng hợp vòng của VPF (cách ghi bàn, kiến tạo, phạt đền): tìm trên `https://vpf.vn/category/tin-tuc/tin-vleague/` bài "Vòng N LPBank V.League 1 …". Đọc bằng agent `web-fetch`, yêu cầu chỉ báo cáo sự kiện.
- Nhận định: lấy danh sách treo giò ở bài VPF "Danh sách cầu thủ nghỉ thi đấu vòng N …".
- Số liệu tự tính được từ `data.json`: thành tích sân nhà/sân khách, chuỗi thắng/bất bại, số trận giữ sạch lưới, top ghi bàn của CLB mùa này, hàng công/hàng thủ tốt nhất giải, trận cùng giờ của đội bám đuổi.

**Bài về cầu thủ / CLB / sự kiện khác**:
- `WebSearch` mode `standard` trước (gửi song song 2 truy vấn tiếng Việt + tiếng Anh), chuyển `extended` nếu kết quả mỏng hoặc có thể cũ.
- Đọc **ít nhất 2 bài gốc từ 2 cơ quan báo khác nhau** bằng agent `web-fetch`, yêu cầu báo cáo sự kiện kèm nguồn của từng sự kiện.
- Ưu tiên nguồn: VPF / VFF / AFC / trang chính thức của giải → báo lớn (VnExpress, Tuổi Trẻ, Thanh Niên, Thể thao & Văn hóa, Bóng đá+, VOV, Nhân Dân) → còn lại.

### 2. Xác minh — không có ngoại lệ

- **Không bịa trích dẫn.** Chỉ dùng câu nói khi nguồn ghi nguyên văn; không có thì viết bài không trích dẫn.
- Thông tin chỉ có 1 nguồn hoặc các nguồn mâu thuẫn → bỏ khỏi bài hoặc viết trung tính, và **báo người dùng** ở phần ghi chú.
- **Không nêu tên HLV / chức danh khi chưa xác minh đúng đội.** (Đã từng suýt nhầm: "HLV Polking" trong bài VPF là HLV Công an Hà Nội, không phải Nam Định.)
- Kiểm tra mùa giải: kết quả tìm kiếm hay lẫn bài mùa trước (VD: vòng 9 mùa 2025/26). Đối chiếu ngày đăng bài.
- Số liệu đã viết phải khớp `data.json` / nguồn — đọc lại một lượt trước khi giao.

### 3. Viết bài

- Tên CLB: lần đầu ghi đầy đủ **Thép Xanh Nam Định**; sau đó có thể "đội bóng thành Nam", "đội chủ nhà"… Sân: **sân vận động Thiên Trường**.
- Tên cầu thủ viết như VPF (ngoại binh có thể rút gọn theo tên thi đấu quen dùng nếu nguồn báo dùng, VD "Caio César").
- **Viết lại bằng lời của mình** — không chép nguyên đoạn từ báo khác (bản quyền).
- Bài tin vui về CLB không cần nêu số liệu tiêu cực không liên quan, nhưng **không được nói sai** để làm đẹp.
- Không dự đoán tỉ số, không cá cược, không thông tin vé/giá vé nếu không có nguồn chính thức.

**Khung bài tường thuật** (Chuyên mục: Trận đấu): mở bài (thời gian, địa điểm, tỉ số, ý nghĩa) → diễn biến theo hiệp với tiêu đề phụ → danh sách **Diễn biến chính** (`20' — Thẻ đỏ: …`, `42' — ⚽ … — 1-0`) → vị trí trên BXH, chuỗi phong độ, top ghi bàn → trận tiếp theo.

**Khung bài nhận định** (Chuyên mục: Trận đấu): mở bài → khối **Thông tin trận đấu** (giải – vòng, giờ – ngày, sân) → phong độ CLB (BXH, chuỗi trận, sân nhà/sân khách, người ghi bàn, lực lượng vắng mặt) → phong độ đối thủ (tương tự, lý do đá ít trận hơn nếu có) → ý nghĩa trận đấu với cuộc đua (trận cùng giờ của đội bám đuổi) → lời mời cổ vũ.

**Khung tin cầu thủ / sự kiện** (Chuyên mục: Tin đội bóng): sự kiện chính trong câu đầu → bối cảnh (giải thưởng là gì, ai tổ chức, tiêu chí) → thành tích làm cơ sở (gạch đầu dòng, có số liệu) → mốc thời gian tiếp theo → lời chúc mừng của CLB.

### 4. Giao bài

Mỗi bài theo đúng thứ tự: **Tiêu đề / Chuyên mục / Tóm tắt / Nội dung**, ngăn cách các bài bằng `---`. Sau bài là **Ghi chú cho bro**:
- Những gì cố ý không đưa vào và lý do (chưa xác minh, mâu thuẫn nguồn…).
- Nhắc ảnh bìa và hạn đăng (nếu có).

Cuối cùng là danh sách **Sources** dạng link markdown — mọi nguồn web đã dùng.
