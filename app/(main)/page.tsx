import HeroSection from "@/components/HeroSection";
import {
  AboutSection,
  NextMatchSection,
  StatsSection,
  FeaturedPlayersSection,
  LatestResultsSection,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <NextMatchSection />
      <StatsSection />
      <FeaturedPlayersSection />
      <LatestResultsSection />
      <CTASection />
    </>
  );
}
