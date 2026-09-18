import HeroSection from "@/components/HeroSection";
import {
  AboutSection,
  NextMatchSection,
  StatsSection,
  FeaturedPlayersSection,
  LatestResultsSection,
  NewsSection,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <NextMatchSection />
      <NewsSection />
      <LatestResultsSection />
      <FeaturedPlayersSection />
      <AboutSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
