# Thép Xanh Nam Định FC — Website chính thức

Website giới thiệu, đội hình, lịch thi đấu và tin tức của CLB Bóng đá Thép Xanh Nam Định.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Payload CMS 3 · MongoDB

---

## Yêu cầu

- Node.js 20+
- MongoDB (local hoặc Atlas)

## Cài đặt

```bash
npm install
```

Tạo file `.env` ở thư mục gốc:

```bash
# Bắt buộc
MONGODB_URI=mongodb://127.0.0.1/namdinh-fc
PAYLOAD_SECRET=<chuỗi bí mật bất kỳ, đủ dài>
NEXT_PUBLIC_SERVER_URL=http://localhost:3000/   # nhớ dấu "/" ở cuối

# Tuỳ chọn — chỉ cần khi dùng tính năng đồng bộ cầu thủ từ API-Football
API_FOOTBALL_KEY=<api key>
API_FOOTBALL_TEAM_ID=5734
API_FOOTBALL_SEASON=2024
```

> ⚠️ **`NEXT_PUBLIC_SERVER_URL` quyết định trang lấy dữ liệu từ đâu.** Toàn bộ page fetch nội dung qua REST API tại địa chỉ này. Nếu để trỏ về site đã deploy (ví dụ `https://namdinhfc.vercel.app/`) thì khi chạy `npm run dev` / `npm run build` ở máy, trang vẫn đọc dữ liệu và **schema của bản deploy**, không phải code đang sửa — collection mới thêm sẽ trả 403 hoặc thiếu field cho tới khi deploy. Khi phát triển ở máy, hãy đặt `http://localhost:3000/`.

## Chạy dự án

```bash
npm run dev
```

- Trang public: <http://localhost:3000>
- Trang quản trị (Payload): <http://localhost:3000/admin> — lần đầu vào sẽ được yêu cầu tạo tài khoản admin.

## Các lệnh khác

| Lệnh | Mô tả |
|---|---|
| `npm run build` | Build production |
| `npm run start` | Chạy bản build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` — chạy trước mỗi commit |
| `npm run generate:types` | Sinh lại `payload-types.ts` sau khi đổi collections/globals |
| `npm run generate:importmap` | Sinh lại import map cho component tuỳ biến trong admin |

> ⚠️ Mỗi khi sửa file trong `collections/` hoặc `globals/`, **phải** chạy `npm run generate:types` và commit `payload-types.ts` kèm theo.

---

## Cấu trúc

```
app/
  (main)/     Trang public — trang chủ, /about, /squad, /contact, /news, /news/[slug]
  (payload)/  Admin + REST/GraphQL API do Payload sinh (không sửa tay)
  api/        Route nghiệp vụ riêng: sync-players, import-players
  globals.css Design system của toàn site

collections/  Payload collections: Users, Players, News, Matches, Media
globals/      Payload globals: SiteSettings
lib/          Logic không phải React: gọi API, parse Excel, mapping dữ liệu
data/         Dữ liệu tĩnh + type domain
components/   UI components
.claude/       CLAUDE.md (quy ước code) + DESIGN_SYSTEM.md
```

## Quản trị nội dung

**Cầu thủ** có 3 nguồn dữ liệu, đánh dấu bằng field `Nguồn dữ liệu`:

1. **Nhập tay** — tạo trực tiếp trong admin.
2. **API Football** — nút *Chạy Đồng Bộ Ngay* ở đầu danh sách Cầu thủ (yêu cầu `API_FOOTBALL_KEY`).
3. **Nhập từ Excel** — nút *Import Excel*; tải file mẫu tại `/api/import-players/template`. Trùng tên sẽ bị bỏ qua, lỗi báo theo từng dòng.

Trong **Cấu hình trang → Nguồn dữ liệu cầu thủ**, chọn nguồn nào sẽ được hiển thị ra trang public (hoặc *Tất cả các nguồn*).

Cả hai endpoint đồng bộ/import đều yêu cầu đăng nhập admin.

**Tin tức** dùng cơ chế nháp/xuất bản gốc của Payload (`versions.drafts`):

- Trong admin, bài viết có nút **Save draft** và **Publish**. Chỉ bài đã Publish mới hiện ra trang public — Payload tự ẩn bản nháp với request chưa đăng nhập.
- Ô **Slug** để trống sẽ tự sinh từ tiêu đề (đã bỏ dấu tiếng Việt).
- Ô **Tóm tắt** để trống thì hệ thống tự cắt 180 ký tự đầu từ nội dung bài.
- **Chuyên mục** dùng cho bộ lọc ở `/news` và khối "Bài viết liên quan".

---