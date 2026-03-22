import ImageSlider from "./ImageSlider";

export default function HeroSection() {
  const heroImages = [
    "/cover-bg.jpg",
    "/thientruong-stadium-team.jpg",
    "/cdv-1.jpg",
  ];

  return (
    <section
      className="section"
      style={{
        position: "relative",
        minHeight: "768px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background image slider */}
      <div
        className="container"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <ImageSlider
          images={heroImages}
          interval={6000}
          className="w-full h-full"
          priority={true}
        />
      </div>

      {/* Subtle radial glow at top center */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(152, 197, 233, 0.08), transparent 70%)",
          top: "-300px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      />

      {/* Geometric dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          opacity: 0.03,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative side gradient */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "600px",
          background:
            "linear-gradient(135deg, rgba(152, 197, 233, 0.06), transparent)",
          top: "10%",
          right: "-100px",
          borderRadius: "50%",
          zIndex: 2,
        }}
      />

      {/* Bottom gradient fade to white */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(to top, white, transparent)",
          zIndex: 3,
        }}
      />
    </section>
  );
}
