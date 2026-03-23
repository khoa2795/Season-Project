import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="py-24 bg-season-gray/10 border-t border-b border-season-gray">
      <div className="container mx-auto px-4 text-center max-w-xl">
        <h3 className="text-2xl font-serif mb-4 tracking-wide text-season-dark">Join the Season</h3>
        <p className="text-neutral-500 font-sans mb-8 leading-relaxed">
          Sign up to receive updates on new collections, exclusive events and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Input 
            type="email" 
            placeholder="Email Address" 
            className="rounded-none border-b border-t-0 border-l-0 border-r-0 border-neutral-300 bg-transparent px-4 py-3 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:border-black transition-colors duration-300 w-full sm:w-80" 
          />
          <Button variant="outline" className="w-full sm:w-auto rounded-none border-black px-8 py-3 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}
