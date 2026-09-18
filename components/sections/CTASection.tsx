import ArrowRight from "@/components/icons/ArrowRight";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

export default function CTASection() {
  return (
    <section id="lien-he" className="home-stadium">
      <Image src="/cdv-1.jpg" alt="Không khí cuồng nhiệt trên khán đài cổ động viên Nam Định"
        fill sizes="100vw" className="object-cover" />
      <div className="home-stadium-shade" aria-hidden="true" />
      <div className="container relative z-10">
        <SectionTitle variant="editorial" eyebrow="Hẹn nhau ở Thiên Trường"
          title="Cùng chung một nhịp đập."
          subtitle="Cảm nhận tình yêu bóng đá thành Nam, từ mặt cỏ đến những khán đài rực lửa." light />
        <Link href="/about" className="btn btn-outline">
          Khám phá Thiên Trường <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
