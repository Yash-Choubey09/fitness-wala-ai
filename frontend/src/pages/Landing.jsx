import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ProgressPreviewSection } from '../components/landing/ProgressPreviewSection';
import { ChatbotPreviewSection } from '../components/landing/ChatbotPreviewSection';

export const Landing = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ProgressPreviewSection />
      <ChatbotPreviewSection />
    </Layout>
  );
};
