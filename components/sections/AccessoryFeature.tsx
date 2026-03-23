import { Button } from "@/components/ui/button";

export function AccessoryFeature() {
  return (
    <section className="py-32 bg-season-gray/5 border-t border-season-gray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="md:col-span-5 md:col-start-2 space-y-8">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-sans block mb-4">
              Accessories
            </span>
            <h2 className="text-5xl md:text-6xl font-serif font-light leading-none text-season-dark">
              The Leather Case
            </h2>
            <p className="font-serif text-lg text-neutral-600 leading-relaxed max-w-sm">
              Handcrafted Italian leather protection for your eyewear. Minimalist design with maximum durability.
            </p>
            <div className="pt-8">
              <Button variant="outline" className="rounded-none border-black px-8 py-6 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
                Shop Accessories
              </Button>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="md:col-span-6 relative aspect-square bg-white shadow-sm border border-season-gray/50 flex items-center justify-center">
            <div className="text-center text-neutral-300">
               <span className="text-xs uppercase tracking-widest block mb-2">Accessory Product Shot</span>
               <span className="block text-4xl opacity-20 font-serif">Leather</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
