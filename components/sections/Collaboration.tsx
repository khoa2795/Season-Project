import { Button } from "@/components/ui/button";

export function Collaboration() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* Left: Image Placeholder */}
        <div className="relative h-full min-h-[50vh] bg-season-gray md:order-1 flex items-center justify-center text-neutral-400">
           <span className="text-sm uppercase tracking-widest text-center px-4">
            Collaboration Campaign Image
            <br />
            (Full Height)
           </span>
           <div className="absolute inset-0 bg-neutral-200 opacity-20" />
        </div>
        
        {/* Right: Content */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-24 md:py-0 bg-white md:order-2">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6 font-sans">
            Limited Edition
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 leading-tight text-season-dark">
            Season x <br />
            Architecture Digest
          </h2>
          <p className="font-serif text-lg leading-relaxed text-neutral-600 mb-10 max-w-md">
            A minimalist approach to structural design. Celebrating the intersection of form and function with brutalist-inspired frames.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-none border-black px-8 py-6 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
              Explore Edit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
