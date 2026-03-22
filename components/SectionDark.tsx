import React from "react";
import SectionBackground from "./sections/SectionBackground";
import SectionTitle from "./SectionTitle";

type Props = {
  title: string;
  subtitle: string;
  chidlren: React.ReactNode;
};

const SectionDark = ({ title, subtitle, chidlren }: Props) => {
  return (
    <section
      style={{
        padding: "5rem 0",
        background:
          "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), var(--color-primary-light))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SectionBackground variant="full" />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <SectionTitle title={title} subtitle={subtitle} light />
        {chidlren}
      </div>
    </section>
  );
};

export default SectionDark;
