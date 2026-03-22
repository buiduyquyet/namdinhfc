interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

const SectionTitle = ({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) => {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: "3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 800,
          color: light ? "white" : "var(--color-gray-900)",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          lineHeight: 1.15,
          marginBottom: "0.75rem",
        }}
      >
        {title}
      </h2>
      <div
        className="rounded-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
          width: "60px",
          height: "4px",
          marginBottom: subtitle ? "1rem" : 0,
        }}
      />
      {subtitle && (
        <p
          style={{
            fontSize: "1.0625rem",
            color: light ? "rgba(255,255,255,0.7)" : "var(--color-gray-500)",
            maxWidth: "560px",
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
