# Design System — Thép Xanh Nam Định FC

Nguồn sự thật duy nhất: [`app/globals.css`](../app/globals.css). File này mô tả cách dùng.

---

## 1. Design tokens

### Màu thương hiệu

| Token | Giá trị | Tailwind class | Dùng cho |
|---|---|---|---|
| `--color-primary` | `#3B82F6` | `text-primary` `bg-primary` | Màu nhấn chính, số liệu, link hover |
| `--color-primary-dark` | `#6BAED6` | `bg-primary-dark` | Nền header, đầu gradient |
| `--color-primary-light` | `#B8D8F0` | `bg-primary-light` | Nền nav item active, cuối gradient |
| `--color-primary-50` | `#EDF5FC` | — | Nền badge nhạt |
| `--color-primary-100` | `#D4E9F7` | — | Nền nhạt |
| `--color-secondary` | `#001838` | `text-secondary` `bg-secondary` | Xanh navy — nền section tối, màu heading |
| `--color-secondary-light` | `#002B5C` | — | |
| `--color-secondary-dark` | `#000E20` | — | |

### Màu phụ trợ

`--color-accent` `#F59E0B` · `--color-accent-dark` `#D97706` · `--color-success` `#10B981` · `--color-danger` `#EF4444`
Thang xám: `--color-gray-50` → `--color-gray-900` (Slate).

> ⚠️ Không hardcode hex trong component. Luôn qua token.

### Typography

| Token | Font | Dùng cho |
|---|---|---|
| `--font-heading` | Montserrat (400–900) | `h1`–`h6`, nút, nav, số liệu |
| `--font-body` / `--font-sans` | Inter (300–700) | body text |

Font nạp bằng `next/font/google` trong `app/(main)/layout.tsx`, có subset `vietnamese`.
Heading mặc định đã được set trong `@layer base`: `font-weight: 700`, `line-height: 1.2`, `color: var(--color-secondary)`.

**Cỡ chữ heading section (chuẩn):** `clamp(1.75rem, 4vw, 2.5rem)`, `font-weight: 800`, `text-transform: uppercase`.

### Spacing / Radius / Shadow

```
--section-padding: 5rem 0

--radius-sm: 0.5rem    --radius-md: 0.75rem    --radius-lg: 1rem
--radius-xl: 1.5rem    --radius-full: 9999px

--shadow-sm / --shadow-md / --shadow-lg / --shadow-xl
--shadow-card        (mặc định của .card)
--shadow-card-hover  (hover của .card)
```

### Transition

```
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms   ← mặc định
--transition-slow: 400ms
```

---

## 2. Class tiện ích trong `globals.css`

### Layout

| Class | Tác dụng |
|---|---|
| `.container` | max-width `1280px`, căn giữa, padding responsive `1.5rem → 2rem (640px) → 4rem (1024px)` |
| `.section` | `padding: 5rem 0`, nền trắng |
| `.section-alt` | như trên + nền `--color-gray-50` (dùng xen kẽ để phân tách section) |

### Button

```html
<Link href="..." className="btn btn-primary">Nhãn</Link>
```

| Class | Style |
|---|---|
| `.btn` | base: pill, uppercase, Montserrat 600, `0.75rem 1.75rem`, border 2px |
| `.btn-primary` | nền primary, chữ navy — hover: sáng hơn + `translateY(-2px)` + glow |
| `.btn-outline` | viền trắng, chữ trắng — **chỉ dùng trên nền tối/gradient** |
| `.btn-outline-dark` | viền navy, chữ navy — dùng trên nền sáng |

### Card & Badge

| Class | Style |
|---|---|
| `.card` | nền trắng, `--radius-md`, `--shadow-card`, border `gray-100` — hover: nâng `-4px` + shadow đậm |
| `.badge` | pill nhỏ, uppercase, `0.75rem`, letter-spacing `0.05em` |
| `.badge-primary` / `.badge-accent` / `.badge-success` | 3 biến thể màu |
| `.divider` | gạch gradient `60×4px`, bo tròn — dùng dưới tiêu đề |
| `.rich-text` | Typography cho nội dung richText từ CMS: heading, list, blockquote, link, `<hr>`, ảnh bo góc. Chỉ dùng qua `news/ArticleContent` |

### Animation

Class utility: `.animate-fade-in-up` · `.animate-fade-in` · `.animate-slide-in-left` · `.animate-slide-in-right` · `.animate-scale-in` · `.animate-float`
Delay: `.delay-100` → `.delay-800` (bước 100ms).
Keyframes có sẵn: `fadeInUp` `fadeIn` `slideInLeft` `slideInRight` `scaleIn` `pulse-glow` `float` `shimmer` `countUp`.

Hiệu ứng stagger theo danh sách → inline style:
```tsx
style={{ animationDelay: `${index * 80}ms` }}
// hoặc
style={{ animation: `fadeInUp 0.6s ease-out ${delay}ms both` }}
```

Khác: `.gradient-text` (chữ gradient). Đã có `@media (prefers-reduced-motion: reduce)` tắt animation toàn cục — không cần xử lý lại.
⚠️ Media query đó **chỉ tắt animation CSS**. Chuyển động do JS điều khiển (autoplay carousel…) phải tự kiểm tra `window.matchMedia("(prefers-reduced-motion: reduce)")`.

### Carousel

| Class | Mô tả |
|---|---|
| `.no-scrollbar` | Ẩn thanh cuộn của track cuộn ngang (Firefox + WebKit). Dùng kèm `overflow-x-auto snap-x snap-mandatory` |

⚠️ `.no-scrollbar` nằm ở cuối `globals.css`, **ngoài mọi `@layer`** — không được chuyển vào `@layer utilities`.
Các rule `::-webkit-scrollbar` toàn cục cũng không nằm trong layer, mà rule ngoài layer luôn thắng rule trong layer
bất kể specificity, nên để trong layer thì thanh cuộn vẫn hiện ra.

---

## 3. Component inventory

### Layout & primitives

| Component | Loại | Mô tả |
|---|---|---|
| `Header` | client | Fixed top, `zIndex: 1000`, nền `primary-dark`, đổi shadow khi scroll >20px. `NAV_ITEMS` khai báo ngay trong file. Smooth-scroll cho link `/#section` |
| `DesktopNav` | server | Ul nav ngang, ẩn dưới `1024px` (qua class `.desktop-nav`) |
| `MobileMenu` | server | Overlay full-screen nền navy, stagger fadeInUp theo index |
| `Footer` | client | Chân trang |
| `PageHero` | client | Hero cho trang con: `paddingTop 160px`, nền navy + `SectionBackground` + watermark logo + breadcrumbs |
| `SectionTitle` | server | Tiêu đề section chuẩn: `title` / `subtitle?` / `align?` / `light?`. **Dùng cho mọi section trang chủ + squad** |
| `about/SectionTitle` | client | Biến thể riêng trang About: có `highlight` (từ tô màu primary). ⚠️ Trùng chức năng — nên hợp nhất |
| `SectionDark` | server | Wrapper section nền gradient primary: tự bọc `SectionBackground` + `SectionTitle light` + `.container` |
| `sections/SectionBackground` | client | Lớp trang trí nền: `variant="dots" \| "dots-double" \| "radial" \| "full"` |

### Content components

| Component | Loại | Mô tả |
|---|---|---|
| `PlayerCard` | server | Card cầu thủ: gradient primary, watermark logo, số áo lớn nền, badge vị trí, avatar tròn, dòng quốc tịch · chiều cao · cân nặng |
| `PlayerCarousel` | client | Carousel cầu thủ 1 hàng, cuộn ngang bằng scroll-snap (không dùng thư viện ngoài). Autoplay 4.5s, tạm dừng khi hover/focus/chạm, tự tắt khi bật giảm chuyển động. Mũi tên hiện từ `md`, số dot bám theo số trang cuộn thật (đo bằng `ResizeObserver`), ẩn cả hai khi mọi slide đã vừa khung |
| `MatchCard` | server | Card trận đấu: `variant="default" \| "featured"`, prop `title` cho biến thể featured. Tự đổi tỉ số ↔ giờ theo `status`, hiện logo đội nếu có (không thì viết tắt tên), nút Mua vé / Xem highlight |
| `LeagueTable` | server | Bảng xếp hạng V.League |
| `StatsCounter` | client | Dãy số liệu đếm — nhận `items: { value, label, suffix? }[]` |
| `ImageSlider` | client | Slider fade tự động: `images` / `interval=5000` / `priority` + dot indicator |
| `news/NewsCard` | server | Card bài viết: ảnh 16:9 (`aspect-video`), badge chuyên mục, ngày, tiêu đề `line-clamp-2`, tóm tắt `line-clamp-3` |
| `news/CategoryTabs` | server | Dải tab lọc chuyên mục — điều hướng bằng `<Link>`, không cần client |
| `news/Pagination` | server | Phân trang dạng pill, giữ nguyên query hiện có qua prop `basePath` |
| `news/ArticleContent` | server | Bọc `RichText` của Payload, gắn class `.rich-text` |

### Sections trang chủ (`components/sections/`)

Thứ tự trong `app/(main)/page.tsx`:
`HeroSection` → `AboutSection` → `NextMatchSection` → `StatsSection` → `FeaturedPlayersSection` → `LatestResultsSection` → `NewsSection` → `CTASection`

Nền các section phải xen kẽ để phân tách thị giác: `LatestResultsSection` dùng `.section-alt` (xám) nên `NewsSection` dùng `.section` (trắng).

Export qua barrel `components/sections/index.ts`.

### Theo trang

- `components/squad/`: `PlayerSection` (nhóm cầu thủ theo vị trí), `SquadStats` (dải số liệu nền navy)
- `components/about/`: `ClubHistory`, `Timeline`, `StadiumSection`, `SectionTitle`
- `components/news/`: `NewsCard`, `CategoryTabs`, `Pagination`, `ArticleContent`
- `components/fixtures/`: `FixtureFilters` (tab Lịch/Kết quả + lọc giải), `MatchMonthGroup` (nhóm trận theo tháng)
- `components/admin/`: `ImportPlayersButton` — inject vào Payload admin qua `admin.components.beforeList` trong `collections/Players.ts`

---

## 4. Anchor ID (dùng cho smooth scroll từ nav)

| ID | Section |
|---|---|
| `gioi-thieu` | AboutSection |
| `lich-thi-dau` | NextMatchSection |
| `doi-hinh` | FeaturedPlayersSection |
| `tin-tuc` | NewsSection |
| `lien-he` | CTASection |

Thêm mục nav mới → thêm vào `NAV_ITEMS` trong `Header.tsx` **và** đặt `id` tương ứng trên `<section>`.

---

## 5. Breakpoint

Tailwind mặc định: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.
Ngưỡng chuyển desktop/mobile của Header là **1024px**.

Grid cầu thủ chuẩn:
```tsx
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6
```

---

## 6. Checklist khi thêm section / trang mới

- [ ] Bọc bằng `<section className="section">` (hoặc `.section-alt` / `<SectionDark>`) + `<div className="container">`
- [ ] Tiêu đề dùng `<SectionTitle>`, không tự viết `<h2>`
- [ ] Màu lấy từ token, không hardcode hex
- [ ] Ưu tiên Tailwind utility; inline style chỉ cho giá trị động
- [ ] Ảnh dùng `next/image`, có `alt` tiếng Việt
- [ ] Mặc định Server Component; chỉ `"use client"` khi cần state/effect
- [ ] Text hiển thị bằng tiếng Việt
- [ ] Có `id` nếu cần link từ nav
- [ ] `npx tsc --noEmit` và `npm run lint` sạch

---

## 7. Nợ kỹ thuật đã biết (không nhân bản)

1. **`<style jsx global>`** trong `Header.tsx`, `Footer.tsx`, `StatsCounter.tsx` — nên chuyển sang Tailwind responsive utility.
2. **Inline style dày đặc**: `LeagueTable` (~30 chỗ), `Footer` (~26) — nên migrate dần sang Tailwind class. `MatchCard` đã migrate xong, dùng làm mẫu.
3. **Hai `SectionTitle`** (root + `about/`) trùng chức năng — cần hợp nhất thành một component có prop `highlight`.
4. **Typo prop `chidlren`** trong `SectionDark.tsx` — nên đổi thành `children` (React children thật) khi có dịp refactor.
5. `HeroSection` không có nội dung text — chỉ là slider + lớp trang trí.
