import { Hero } from "@/components/sections/Hero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Collaboration } from "@/components/sections/Collaboration";
import { AccessoryFeature } from "@/components/sections/AccessoryFeature";
import { Newsletter } from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ProductGrid />
      <Collaboration />
      <AccessoryFeature />
      <Newsletter />
    </main>
  );
}
