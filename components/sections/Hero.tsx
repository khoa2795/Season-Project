import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroImage from "@/image/landing-page/hero_image.jpg";

export function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[90vh] flex flex-col items-center justify-center bg-white border-b border-season-gray">
      <Image
        src={heroImage}
        alt="Atmospheric campaign visual"
        fill
        sizes="100vw"
        className="object-cover object-top md:object-center"
        priority
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center gap-8 animate-in fade-in zoom-in duration-700">
        <h1 className="text-2xl md:text-5xl font-serif text-white uppercase tracking-[0.20em] font-extralight drop-shadow-md">
          New Collections
        </h1>
        <Button
          variant="outline"
          className="rounded-none border-white bg-transparent px-8 py-6 font-sans text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-300 backdrop-blur-sm"
        >
          Shop Now
        </Button>
      </div>
    </section>
  );
}
