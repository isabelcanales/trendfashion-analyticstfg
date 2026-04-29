import HeroSection from "@/components/home/HeroSection";
import HomeMetricsSection from "@/components/home/HomeMetricsSection";
import PageContainer from "@/components/layout/PageContainer";

export default function Home() {
  return (
    <PageContainer className="py-0">
      <HeroSection />
      <HomeMetricsSection />
    </PageContainer>
  );
}