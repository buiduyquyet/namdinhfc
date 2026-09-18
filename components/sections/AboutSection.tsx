import ArrowRight from "@/components/icons/ArrowRight";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

export default function AboutSection() {
  return (
    <section id="about" className="home-section home-story">
      <div className="container home-story-grid">
        <div className="home-story-image">
          <Image
            src="/cover-bg-2.jpg"
            alt="Chiếc cúp được nâng cao giữa cầu thủ và người hâm mộ tại Thiên Trường"
            fill sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
          <span className="home-story-year">1965<span>Khởi đầu một niềm tự hào</span></span>
        </div>
        <div>
          <SectionTitle variant="editorial" eyebrow="Câu chuyện của chúng ta" title="Từ thành Nam, với tất cả tự hào." />
          <p className="home-story-copy">
            Từ đội Thanh niên Nam Hà năm 1965 đến Thép Xanh Nam Định hôm nay,
            tình yêu bóng đá luôn nối liền những thế hệ người thành Nam.
          </p>
          <p className="home-story-copy">
            Trên sân cỏ hay giữa khán đài Thiên Trường, mỗi khoảnh khắc đều
            được viết nên bằng sự gắn bó của đội bóng và người hâm mộ.
          </p>
          <Link href="/about" className="home-text-link">
            Khám phá câu chuyện CLB <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
