"use client";

interface SectionBackgroundProps {
  variant?: "dots" | "dots-double" | "radial" | "full";
  className?: string;
}

const SectionBackground = ({
  variant = "full",
  className = "",
}: SectionBackgroundProps) => {
  const patterns = {
    dots: (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
    ),
    "dots-double": (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 50%, white 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />
    ),
    radial: (
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(152, 197, 233, 0.06), transparent 70%)",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    ),
    full: (
      <>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: `
              radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, white 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(152, 197, 233, 0.06), transparent 70%)",
            top: "-200px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </>
    ),
  };

  return (
    <div className={className} style={{ position: "absolute", inset: 0 }}>
      {patterns[variant]}
    </div>
  );
};

export default SectionBackground;
