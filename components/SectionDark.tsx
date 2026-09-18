import React from "react";
import SectionTitle from "./SectionTitle";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const SectionDark = ({ title, subtitle, children }: Props) => {
  return (
    <section className="home-section home-stats-section">
      <div className="container">
        <SectionTitle variant="editorial" title={title} subtitle={subtitle} light />
        {children}
      </div>
    </section>
  );
};

export default SectionDark;
