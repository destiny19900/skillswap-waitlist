import Navbar from '@/components/ui/Navbar';
import Hero from '@/sections/Hero';
import WaitlistForm from '@/sections/WaitlistForm';
import SkillCategories from '@/sections/SkillCategories';
import EarnByTeaching from '@/sections/EarnByTeaching';
import Decentralized from '@/sections/Decentralized';
import WhyNow from '@/sections/WhyNow';
import Footer from '@/sections/Footer';
import PopularSkills from '@/sections/PopularSkills';
import SkillLottieShowcase from '@/sections/SkillLottieShowcase';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <Hero />
        <div id="waitlist">
          <WaitlistForm />
        </div>
        <PopularSkills />
        <div id="categories">
          <SkillCategories />
        </div>
        <SkillLottieShowcase />
        <div id="teaching">
          <EarnByTeaching />
        </div>
        <div id="features">
          <Decentralized />
        </div>
        <div id="about">
          <WhyNow />
        </div>
        <Footer />
      </main>
    </>
  );
} 