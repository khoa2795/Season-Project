import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Collaboration } from "@/components/sections/Collaboration";
import { AccessoryFeature } from "@/components/sections/AccessoryFeature";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <Hero />
      <ProductGrid />
      <Collaboration />
      <AccessoryFeature />
      <Newsletter />
      <Footer />
    </main>
  );
}
