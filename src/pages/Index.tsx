import Header99acres from '@/components/layout/Header99acres';
import Footer from '@/components/layout/Footer';
import Hero99acres from '@/components/home/Hero99acres';
import ContinueBrowsing99acres from '@/components/home/ContinueBrowsing99acres';
import CategoryCards99acres from '@/components/home/CategoryCards99acres';
import ProjectsInDemand from '@/components/home/ProjectsInDemand';
import NewlyLaunchedProjects from '@/components/home/NewlyLaunchedProjects';
import ExclusiveAds from '@/components/home/ExclusiveAds';
import DemandInHyderabad from '@/components/home/DemandInHyderabad';
import UpcomingProjects from '@/components/home/UpcomingProjects';
import OffersForYou from '@/components/home/OffersForYou';
import PopularBuilders from '@/components/home/PopularBuilders';
import TopGainers from '@/components/home/TopGainers';
import BHKChoice from '@/components/home/BHKChoice';
import AdvertiserType from '@/components/home/AdvertiserType';
import MoveInTimeline from '@/components/home/MoveInTimeline';
import ExploreCities from '@/components/home/ExploreCities';
import PostPropertyBanner from '@/components/home/PostPropertyBanner';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 99acres Style Header */}
      <Header99acres />

      <main>
        {/* 1. Hero Banner with overlapping Search Widget */}
        <Hero99acres />

        {/* 2. Continue Browsing + Guest User Card */}
        <ContinueBrowsing99acres />

        {/* 3. Category Cards (Apartments, Villas & More) */}
        <CategoryCards99acres />

        {/* 4. Projects in High Demand */}
        <ProjectsInDemand />

        {/* 5. Newly Launched Projects */}
        <NewlyLaunchedProjects />

        {/* 6. Exclusive Ads */}
        <ExclusiveAds />

        {/* 7. Demand in Hyderabad */}
        <DemandInHyderabad />

        {/* 8. Upcoming Projects */}
        <UpcomingProjects />

        {/* 9. Offers For You */}
        <OffersForYou />

        {/* 10. Popular Builders */}
        <PopularBuilders />

        {/* 11. Top Gainers Table */}
        <TopGainers />

        {/* 12. BHK Choice Selector */}
        <BHKChoice />

        {/* 13. Choose Type of Advertiser */}
        <AdvertiserType />

        {/* 14. Move In Timeline */}
        <MoveInTimeline />

        {/* 15. Post Property Banner */}
        <PostPropertyBanner />

        {/* 16. Explore Cities */}
        <ExploreCities />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
