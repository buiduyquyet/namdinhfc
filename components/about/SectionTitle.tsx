"use client";

interface SectionTitleProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionTitle = ({
  title,
  highlight,
  subtitle,
  centered = true,
}: SectionTitleProps) => {
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} mb-12 md:mb-16`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary uppercase tracking-tight">
        {title}{" "}
        {highlight && (
          <span className="text-primary">{highlight}</span>
        )}
      </h2>
      <div
        className={`w-20 h-1.5 bg-primary mt-4 rounded-full ${centered ? "mx-auto" : ""
          }`}
      />
      {subtitle && (
        <p className="mt-4 text-gray-500 text-lg">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
