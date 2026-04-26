import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ProgressPreviewSection } from '../components/landing/ProgressPreviewSection';
import { ChatbotPreviewSection } from '../components/landing/ChatbotPreviewSection';
import { CTASection } from '../components/landing/CTASection';
import { BMICalculator } from '../components/landing/BMICalculator';
import { BodyTypeSection } from '../components/landing/BodyTypeSection';
import { MaintenanceCalculator } from '../components/landing/MaintenanceCalculator';

const QuickToolsSection = () => (
  <section className="py-24 bg-[#050606] border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-neonCyan/80 font-bold mb-4">Try before you sign up</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Instant tools for every visitor</h2>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Access BMI, body type, and maintenance calculators right on the homepage — no login required.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <a href="#bmi-calculator" className="group block rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-neonCyan/40 hover:bg-white/10 transition">
          <p className="text-xs uppercase tracking-[0.25em] text-neonCyan font-bold mb-3">BMI Calculator</p>
          <h3 className="text-xl font-black text-white mb-2">Calculate your BMI</h3>
          <p className="text-gray-400 text-sm">Quick body mass index results with instant category feedback.</p>
        </a>
        <a href="#body-type" className="group block rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-neonPurple/40 hover:bg-white/10 transition">
          <p className="text-xs uppercase tracking-[0.25em] text-neonPurple font-bold mb-3">Body Type Insight</p>
          <h3 className="text-xl font-black text-white mb-2">Know your somatotype</h3>
          <p className="text-gray-400 text-sm">Understand whether you are ectomorph, mesomorph, or endomorph.</p>
        </a>
        <a href="#maintenance-calculator" className="group block rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-neonGreen/40 hover:bg-white/10 transition">
          <p className="text-xs uppercase tracking-[0.25em] text-neonGreen font-bold mb-3">Maintenance Estimate</p>
          <h3 className="text-xl font-black text-white mb-2">Find your TDEE</h3>
          <p className="text-gray-400 text-sm">Estimate daily calories burned based on age, weight, height and activity.</p>
        </a>
      </div>
    </div>
  </section>
);

export const Landing = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickToolsSection />
      <FeaturesSection />
      <BodyTypeSection />
      <BMICalculator />
      <MaintenanceCalculator />
      <HowItWorksSection />
      <ProgressPreviewSection />
      <ChatbotPreviewSection />
      <CTASection />
    </Layout>
  );
};
