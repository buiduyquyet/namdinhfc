# CLAUDE.md — Namdinh FC Website

Website chính thức CLB Thép Xanh Nam Định. Next.js 16 (App Router) + Payload CMS 3 (MongoDB) + Tailwind CSS v4.

> **Bắt buộc đọc trước khi code UI:** [.claude/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — design tokens, component inventory, quy ước layout.

---

## 1. Kiến trúc thư mục

```
app/
  (main)/            # Route group public — có Header/Footer, dùng globals.css
    layout.tsx       #   root layout: <html lang="vi">, font Montserrat + Inter, metadata SEO
    page.tsx         #   trang chủ = ghép các section từ components/sections
    about/, squad/, contact/, news/, news/[slug]/, fixtures/
  (payload)/         # Route group admin — do Payload sinh ra, KHÔNG sửa tay
    admin/[[...segments]]/page.tsx
    api/[...slug]/route.ts      # REST + GraphQL của Payload
  api/               # Route handler nghiệp vụ riêng (không phải của Payload)
    import-players/
  globals.css        # Design system duy nhất của toàn site

collections/         # Payload collections: Users, Players, News, Matches, Media
globals/             # Payload globals: SiteSettings
lib/                 # Logic không phải React: fetch API, parse Excel, mapping
data/                # Dữ liệu tĩnh + type domain (Player, Match, LeagueTableEntry…)
components/          # UI components (xem mục 3)
public/              # Ảnh tĩnh; `public/media` là nơi Payload lưu file upload
```

**Alias import:** `@/*` → root. Luôn dùng `@/components/...`, `@/lib/...`, không dùng `../../`.

---

## 2. Rule coding chung

### TypeScript
- `strict: true`. **Không dùng `any`** — dùng `unknown` rồi narrow:
  ```ts
  catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
  }
  ```
- Type domain đặt trong `data/*.ts` và export cùng file với dữ liệu (`Player` + `players`, `Match` + `matches`).
- Props component: khai báo `interface XxxProps` ngay trên component, không export trừ khi dùng lại nơi khác.

### Component
- Mặc định là **Server Component**. Chỉ thêm `"use client"` khi thật sự cần `useState` / `useEffect` / event handler.
  - Server Component có thể `async` và gọi thẳng `getPayloadPlayers()` — xem `components/sections/FeaturedPlayersSection.tsx`.
- Khai báo dạng arrow function + `export default` ở cuối file:
  ```tsx
  const PlayerCard = ({ player, index = 0 }: PlayerCardProps) => { ... };
  export default PlayerCard;
  ```
  (Server Component async được phép dùng `export default async function`.)
- **Một component = một file.** Component phụ chỉ dùng nội bộ thì để cùng file (ví dụ `StatItem` trong `SquadStats.tsx`).
- Component < ~150 dòng. Vượt quá thì tách (như `Header` → `DesktopNav` + `MobileMenu`).
- Barrel export cho nhóm section: `components/sections/index.ts`.

### Ngôn ngữ
- **Toàn bộ text hiển thị cho người dùng là tiếng Việt** — bao gồm cả `label` trong Payload collections và message lỗi API.
- Tên biến / hàm / file: tiếng Anh.
- Comment: tiếng Việt hoặc tiếng Anh đều được, nhưng comment cho logic nghiệp vụ Việt Nam (parse Excel, mapping vị trí) nên viết tiếng Việt cho khớp file hiện có.

### Data fetching
- Fetch Payload qua REST API trong `lib/*-api.ts`, **không** import `getPayload` vào page/component.
  Dùng helper chung ở `lib/payload-rest.ts` (`payloadFetch`, `resolveMediaUrl`, `PayloadListResponse`) thay vì gọi `fetch` thô:
  ```ts
  const data = await payloadFetch<PayloadListResponse<News>>(`news?limit=9&depth=1`)
  ```
- `NEXT_PUBLIC_SERVER_URL` quyết định page đọc dữ liệu từ đâu. Khi dev ở máy phải đặt `http://localhost:3000/`,
  nếu trỏ về site đã deploy thì trang sẽ đọc **schema của bản deploy** — collection mới thêm trả 403 cho tới khi deploy.
- `getPayload({ config })` chỉ dùng trong `app/api/**/route.ts` (server-side write).
- **Nguồn dữ liệu cầu thủ / trận đấu là Payload CMS** (nhập tay trong admin hoặc import Excel). Không tích hợp API bóng đá bên ngoài — dữ liệu của họ không chính xác, đã gỡ bỏ.
- **Luôn có fallback**: lỗi fetch → `console.error` + trả mảng rỗng / dữ liệu tĩnh, không để page crash (xem `lib/matches-api.ts`, `lib/payload-api.ts`).
  Phân biệt rõ: **API lỗi** → fallback `data/*.ts`; **API trả 0 bản ghi** → trả rỗng để UI hiện empty state, không dựng dữ liệu giả (xem `lib/matches-api.ts`).
- Ngày giờ từ Payload là UTC. Đổi sang giờ Việt Nam bằng helper trong `lib/format-date.ts`, **không** dùng `new Date(x).getHours()` trực tiếp.
- Mapping giữa 2 domain (Payload dùng vị trí tiếng Việt, UI dùng `Position` tiếng Anh) đặt trong `lib/`, không rải trong component.

### API route
- Route ghi dữ liệu **phải check auth**:
  ```ts
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ success: false, error: '...' }, { status: 401 })
  ```
- Response chuẩn: `{ success: true, ...data }` hoặc `{ success: false, error: string }` + đúng HTTP status.
- Validate input trước khi chạm DB (đuôi file, dung lượng, kiểu dữ liệu).

### Payload collections
- Mọi field có `label` tiếng Việt.
- Collection cần đọc từ trang public → `access: { read: () => true }`.
- Hằng số option dùng chung giữa collection và UI đặt trong `lib/` (mẫu: `lib/player-source.ts`, `lib/news-category.ts`, `lib/competition.ts`).
- Cần trạng thái nháp/xuất bản → dùng `versions: { drafts: true }` của Payload, **không** tự tạo field `status`.
  Payload tự ẩn bản nháp khỏi request chưa đăng nhập, nên `access.read` chỉ cần `() => true` (mẫu: `collections/News.ts`).

---

## 3. Rule UI/CSS (tóm tắt — chi tiết ở .claude/DESIGN_SYSTEM.md)

**Thứ tự ưu tiên khi style, từ trên xuống:**

1. **Class tiện ích trong `globals.css`**: `.container`, `.section`, `.section-alt`, `.btn .btn-primary`, `.card`, `.badge`, `.divider`, `.rich-text`.
2. **Tailwind utility** với token đã map: `text-primary`, `bg-secondary`, `font-heading`, `rounded-full`.
3. **Inline `style={{}}`** — chỉ khi giá trị động (animation delay theo index, gradient phức tạp, `clamp()`).

**Cấm:**
- ❌ Hardcode màu hex trong component (`#3B82F6`) → dùng `var(--color-primary)` hoặc `text-primary`.
- ❌ Thêm `<style jsx global>` mới — 3 file hiện có (`Header`, `Footer`, `StatsCounter`) là nợ kỹ thuật, không nhân bản.
- ❌ Tạo file `.css` rời. Design system chỉ nằm ở `app/globals.css`.
- ❌ Viết lại `SectionTitle` / `PageHero` / `SectionBackground` — dùng lại component có sẵn.

**Bố cục 1 section chuẩn:**
```tsx
<section id="ten-section" className="section">        {/* hoặc .section-alt */}
  <div className="container">
    <SectionTitle title="..." subtitle="..." />
    {/* nội dung */}
  </div>
</section>
```
Section nền tối/gradient → dùng `<SectionDark>` (bọc sẵn `SectionBackground` + `SectionTitle light`).

**Ảnh:** luôn `next/image`. Domain ngoài phải khai báo trong `next.config.ts`.

**Animation:** dùng class có sẵn (`animate-fade-in-up`, `delay-100`…). Stagger theo index thì inline `animationDelay: ${index * 80}ms`.

---

## 4. Git

- Commit message theo mẫu đang dùng: `[Fix]: ...`, `[Update]: ...`, `[Refactor]: ...` (hoặc `fix: ...`). Nội dung tiếng Anh.
- Branch chính: `master`.
- **Không commit `.env`** (đã ignore). Biến môi trường đang dùng: `MONGODB_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`.

## 5. Lệnh

```bash
npm run dev              # dev server — http://localhost:3000, admin ở /admin
npm run build
npm run lint             # bắt buộc sạch trước khi commit
npm run typecheck        # tsc --noEmit — bắt buộc sạch trước khi commit
npm run generate:types   # sinh lại payload-types.ts
npm run generate:importmap
```

### Dev server — quy ước cho AI agent

- **Mặc định: không tự bật `npm run dev`.** Kiểm tra bằng `npm run typecheck` / `npm run lint` / `npm run build` là đủ cho phần lớn thay đổi; phần chạy thử trên trình duyệt để người dùng tự làm, đỡ tốn token.
- Nếu **thật sự cần** bật (ví dụ phải gọi REST API của Payload để xác minh), thì:
  - **bắt buộc tự tắt ngay sau khi kiểm tra xong** — `pkill -f "next dev"; pkill -f "next-server"`, rồi `lsof -ti tcp:3000 | xargs -r kill -9`;
  - báo cho người dùng biết là đã bật và đã tắt.
- Lý do: Next 16 chỉ cho phép **một** `next dev` trên cùng thư mục. Server bỏ quên sẽ chiếm cổng 3000 và làm `npm run dev` của người dùng chạy nhầm sang cổng khác.
- Trước khi bật, luôn kiểm tra xem người dùng đã có server đang chạy chưa (`lsof -ti tcp:3000`). **Không kill server của người dùng** — nếu buộc phải restart (sửa `collections/` hoặc `globals/` thì Payload không nhận qua HMR), phải nói rõ trong câu trả lời.

⚠️ **Sửa `collections/` hoặc `globals/` → phải chạy `npm run generate:types` và commit `payload-types.ts` kèm theo.**
Type của CMS **luôn import từ `@/payload-types`**, không tự khai báo interface tay:
```ts
import type { Player as PayloadPlayer, SiteSetting } from '@/payload-types'
```
(Domain type của UI vẫn nằm ở `data/*.ts` — `lib/payload-api.ts` là nơi map giữa hai bên.)
