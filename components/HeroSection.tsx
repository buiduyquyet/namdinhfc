import Link from "next/link";
import ArrowRight from "@/components/icons/ArrowRight";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function HeroSection() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <HeroSlideshow />
      <div className="container relative z-10">
        <div className="home-hero-content">
          <p className="home-eyebrow">Thép Xanh Nam Định FC</p>
          <h1 id="home-title">Hào khí<br /><span>Đông A.</span></h1>
          <p className="home-hero-description">
            Niềm tự hào thành Nam.
          </p>
          <div className="home-hero-actions">
            <Link href="/fixtures" className="btn btn-primary">
              Lịch thi đấu <ArrowRight />
            </Link>
            <Link href="/news" className="home-text-link">
              Tin mới từ CLB <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
