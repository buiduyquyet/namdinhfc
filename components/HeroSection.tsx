import ImageSlider from "./ImageSlider";

const HeroSection = () => {
  const heroImages = [
    "/cover-bg.jpg",
    "/thientruong-stadium-team.jpg",
    "/cdv-1.jpg",
  ];

  return (
    <section
      className="relative overflow-hidden pt-[75px] lg:pt-0"
      style={{
        backgroundColor: "var(--color-secondary)",
      }}
    >
      <div className="relative aspect-3/2 w-full sm:aspect-16/10 lg:h-192 lg:aspect-auto">
        {/* Background image slider */}
        <div className="absolute inset-0 z-1">
          <ImageSlider
            images={heroImages}
            interval={6000}
            className="h-full w-full"
            controlsClassName="bottom-3 sm:bottom-4"
            priority={true}
          />
        </div>

        {/* Top overlay to soften the fixed header overlap */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(to bottom, rgba(0, 24, 56, 0.28) 0%, rgba(0, 24, 56, 0.08) 28%, rgba(0, 24, 56, 0) 48%)",
          }}
        />

        {/* Subtle radial glow at top center */}
        <div
          style={{
            position: "absolute",
            width: "clamp(420px, 70vw, 800px)",
            height: "clamp(420px, 70vw, 800px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(152, 197, 233, 0.08), transparent 70%)",
            top: "clamp(-220px, -24vw, -300px)",
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
          className="hidden md:block"
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
            height: "clamp(20px, 4vw, 40px)",
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 0.7), transparent)",
            zIndex: 3,
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
