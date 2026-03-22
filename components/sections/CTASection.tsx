import Link from "next/link";
import SectionBackground from "./SectionBackground";

const containerStyles = {
  position: "relative" as const,
  zIndex: 1,
};

const titleStyles = {
  fontFamily: "var(--font-heading)",
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  fontWeight: 800,
  color: "var(--color-secondary)",
  textTransform: "uppercase" as const,
  marginBottom: "1rem",
};

const descriptionStyles = {
  fontSize: "1.0625rem",
  color: "var(--color-secondary)",
  maxWidth: "560px",
  margin: "0 auto 2rem",
  lineHeight: 1.7,
};

const buttonContainerStyles = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
  flexWrap: "wrap" as const,
};

export default function CTASection() {
  return (
    <section
      id="lien-he"
      style={{
        padding: "5rem 0",
        background:
          "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SectionBackground variant="dots" />

      <div className="container" style={containerStyles}>
        <h2 style={titleStyles}>Khám Phá Chảo Lửa Thiên Trường</h2>
        <p style={descriptionStyles}>
          Sân vận động 30.000 chỗ ngồi — nơi tình yêu bóng đá cháy bỏng nhất
          Việt Nam
        </p>
        <div style={buttonContainerStyles}>
          <Link href="/about" className="btn btn-primary">
            Tìm Hiểu Thêm
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Liên Hệ Với CLB
          </Link>
        </div>
      </div>
    </section>
  );
}
