import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
    </main>
  );
}
