# TODO — Website Thép Xanh Nam Định FC

Kế hoạch phát triển. Quy ước: `[ ]` chưa làm · `[x]` xong · 🔴 ưu tiên cao · 🟡 trung bình · 🟢 thấp.

> Trước khi code đọc [.claude/CLAUDE.md](.claude/CLAUDE.md) và [.claude/DESIGN_SYSTEM.md](.claude/DESIGN_SYSTEM.md).
> Mỗi task xong phải: `npm run typecheck` + `npm run lint` sạch, `npm run build` chạy được.

---

## Đang chờ xử lý ngay

- [ ] 🔴 **Deploy và verify module tin tức + lịch thi đấu** — sau khi deploy lên Vercel, kiểm tra:
  - [ ] Bài **nháp KHÔNG** hiện với khách chưa đăng nhập (mở `/news` ở cửa sổ ẩn danh + gọi thẳng `/api/news`)
  - [ ] Ảnh bìa, rich text, bài liên quan render đúng
  - [ ] Slug tiếng Việt tự sinh đúng, không trùng
  - [ ] `/fixtures` hiện đúng sau khi nhập trận, giờ thi đấu không lệch ngày (Payload lưu UTC)
- [ ] 🟡 **`.env` local** — đặt `NEXT_PUBLIC_SERVER_URL=http://localhost:3000/` khi dev ở máy, nếu không trang sẽ đọc dữ liệu và schema của bản deploy.

---

## Đợt 1 — Vá lỗ hổng ✅

- [x] Generate `payload-types.ts` + script `generate:types` / `generate:importmap` / `typecheck`
- [x] Bỏ interface CMS khai tay trong `lib/payload-api.ts`, dùng type sinh tự động
- [x] Chặn auth cho `/api/sync-players` (trước đó ai cũng GET được để ghi DB)
- [x] Sửa `averageAge` NaN ở trang Đội hình + thêm field `dateOfBirth` cho Players
- [x] Trang `/contact`
- [x] Viết lại README theo dự án thật
- [x] Dọn ESLint sạch, `images.domains` → `remotePatterns`

---

## Đợt 2 — Tính năng lõi

### 2.1 Module tin tức ✅

- [x] Collection News dùng `versions: { drafts: true }`, thêm `excerpt` / `category` / slug tự sinh
- [x] `lib/payload-rest.ts` (helper REST dùng chung), `lib/news-api.ts`, `lib/slug.ts`, `lib/format-date.ts`
- [x] `components/news/`: `NewsCard`, `CategoryTabs`, `Pagination`, `ArticleContent` + class `.rich-text`
- [x] Trang `/news` (lưới, lọc chuyên mục, phân trang, empty state)
- [x] Trang `/news/[slug]` (metadata + OpenGraph, bài liên quan, 404 khi sai slug)
- [x] `NewsSection` trang chủ + link "Tin Tức" ở Header/Footer

### 2.2 Trang lịch thi đấu `/fixtures` ✅

- [x] Bổ sung collection `Matches`: mở `access.read`, thêm `matchday` / `ticketUrl` / `highlightUrl`, `competition` chuyển sang select
- [x] `lib/matches-api.ts` — map `Matches` (Payload) ↔ `Match`, `groupMatchesByMonth`, quy đổi giờ UTC → giờ VN
- [x] Trang `/fixtures`: tab **Lịch thi đấu** / **Kết quả**, nhóm theo tháng, lọc theo giải đấu
- [x] `NextMatchSection` + `LatestResultsSection` đọc dữ liệu CMS
- [x] Giữ `data/matches.ts` làm fallback khi API lỗi
- [x] Sửa link 404 ở Header, Footer và nút "Xem Tất Cả Lịch Thi Đấu"
- [x] Sửa bug `MatchCard` (luôn hiện "Trận kế tiếp" + badge LIVE, chữ trắng trên nền trắng) + migrate sang Tailwind
- [ ] Nhập lịch thi đấu mùa giải thật vào CMS — hiện collection đang trống nên trang hiện empty state

### 2.3 Trang chi tiết cầu thủ `/squad/[slug]` 🔴

- [ ] Thêm field cho Players: `slug` (tự sinh từ tên, unique), `bio` (richText), `height`, `weight`, `preferredFoot`, `joinedDate`
- [ ] Trang `/squad/[slug]`: ảnh lớn, thông tin cá nhân, thống kê mùa giải, tiểu sử
- [ ] Sửa `FeaturedPlayersSection` — hiện đang `<Link>` tới trang chưa tồn tại
- [ ] `PlayerCard` link sang trang chi tiết ở cả trang `/squad`
- [ ] `generateMetadata` cho SEO từng cầu thủ

---

## Đợt 3 — Chất lượng & đồng nhất

- [ ] 🟡 **Hợp nhất 2 `SectionTitle`** (`components/SectionTitle.tsx` và `components/about/SectionTitle.tsx`) thành một component có prop `highlight`
- [ ] 🟡 **Migrate inline style → Tailwind**: `LeagueTable` (~30 chỗ), `Footer` (~26). `MatchCard` đã xong, dùng làm mẫu
- [ ] 🟡 **Bỏ `<style jsx global>`** ở `Header`, `Footer`, `StatsCounter` — chuyển sang Tailwind responsive utility
- [ ] 🟢 **Sửa typo prop `chidlren`** trong `components/SectionDark.tsx` → dùng `children` thật của React
- [ ] 🟡 **Bảng xếp hạng động** — tạo collection `LeagueTable` hoặc sync từ API-Football, thay `data/league-table.ts` tĩnh
- [ ] 🟢 Chuẩn hoá `SectionBackground` — gom các lớp trang trí lặp trong `HeroSection` vào component

---

## Đợt 4 — Vận hành & hạ tầng

- [ ] 🔴 **Cloud storage cho Media** — `public/media` không tồn tại trên Vercel serverless, **ảnh upload sẽ mất sau mỗi lần deploy**. Chuyển sang `@payloadcms/storage-s3` hoặc Vercel Blob. *(đang gác lại chờ quyết định)*
- [ ] 🔴 `app/sitemap.ts` + `app/robots.ts` (gồm cả URL động của news và squad)
- [ ] 🟡 `loading.tsx` / `error.tsx` / `not-found.tsx` cho các route group
- [ ] 🟡 GitHub Action chạy `typecheck` + `lint` + `build` trên mỗi PR
- [ ] 🟡 Tách môi trường staging / production (DB + `NEXT_PUBLIC_SERVER_URL` riêng) — hiện local đang dùng chung Atlas với bản deploy
- [ ] 🟢 Thêm `.env.example` vào repo
- [ ] 🟢 Rate limit cho `/api/import-players` và `/api/sync-players`

---

## Đợt 5 — Feature mở rộng

### Nội dung

- [ ] 🟡 **Trang sân vận động `/stadium`** — lịch sử Thiên Trường, thông số, thư viện ảnh, hướng dẫn đi lại
- [ ] 🟡 **Thư viện ảnh / video** `/gallery` — collection `Gallery`, lightbox, nhúng highlight YouTube
- [ ] 🟡 **Trang danh hiệu `/honours`** — tách phần thành tích khỏi `/about`, dùng `data/club-info.ts`
- [ ] 🟢 **Ban huấn luyện** — collection `Staff` hoặc mở rộng `Players` bằng field `type` (cầu thủ / BHL)
- [ ] 🟢 **Chuyên trang mùa giải** — thống kê tổng hợp theo mùa

### Tương tác

- [ ] 🟡 **Tìm kiếm toàn site** — tìm theo tin tức + cầu thủ
- [ ] 🟢 **Đăng ký nhận tin** — form email + tích hợp dịch vụ gửi mail
- [ ] 🟢 **Thông tin vé** — link/hướng dẫn mua vé cho từng trận trong `/fixtures`
- [ ] 🟢 **Bình chọn cầu thủ hay nhất trận** — cần chống spam

### Kỹ thuật

- [ ] 🟡 **SEO nâng cao** — JSON-LD (`SportsTeam`, `NewsArticle`, `SportsEvent`), ảnh OpenGraph động
- [ ] 🟡 **Analytics** — Vercel Analytics hoặc GA4
- [ ] 🟢 **Đa ngôn ngữ (vi/en)** — Payload localization + `next-intl`. Việc lớn, cân nhắc nhu cầu thật
- [ ] 🟢 **Tối ưu ảnh** — chuẩn hoá kích thước upload trong Payload, thêm `blurDataURL`
- [ ] 🟢 **Test** — Playwright smoke test cho các route chính

---

## Nợ kỹ thuật đã biết

Chi tiết ở mục 7 của [.claude/DESIGN_SYSTEM.md](.claude/DESIGN_SYSTEM.md).

| Vấn đề | File | Đợt xử lý |
|---|---|---|
| `<style jsx global>` | `Header`, `Footer`, `StatsCounter` | 3 |
| Inline style dày đặc | `LeagueTable`, `Footer` | 3 |
| 2 `SectionTitle` trùng chức năng | `components/`, `components/about/` | 3 |
| Typo prop `chidlren` | `SectionDark.tsx` | 3 |
| Dữ liệu tĩnh chưa nối CMS | `data/league-table.ts` | 3 |
| Media lưu ổ đĩa cục bộ | `collections/Media.ts` | 4 |
