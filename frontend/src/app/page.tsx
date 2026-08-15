import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Product } from "@/components/landing/product";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Security } from "@/components/landing/security";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { BackgroundEffects } from "@/components/landing/background-effects";

export default function Home() {
  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main>
        <Hero />
        <Product />
        <HowItWorks />
        <Features />
        <Security />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
