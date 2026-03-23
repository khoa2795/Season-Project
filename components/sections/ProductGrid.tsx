import Image from "next/image";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Season 01 / Black",
    price: "$295",
    description: "Acetate Frame",
    image: "/placeholder-1.jpg",
  },
  {
    id: 2,
    name: "Season 02 / Tortoise",
    price: "$325",
    description: "Acetate Frame",
    image: "/placeholder-2.jpg",
  },
  {
    id: 3,
    name: "Season 03 / Clear",
    price: "$310",
    description: "Acetate Frame",
    image: "/placeholder-3.jpg",
  },
];

export function ProductGrid() {
  return (
    <section className="py-24 bg-white border-b border-season-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif text-center mb-16 tracking-wide">The Core Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-[4/5] bg-season-gray mb-6 relative overflow-hidden">
                {/* Placeholder for Product Image */}
                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:scale-105 transition-transform duration-700 ease-season">
                  <span className="text-xs uppercase tracking-widest">Product Image</span>
                </div>
                
                {/* Hover overlay with button */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <Button variant="secondary" className="bg-white text-black hover:bg-black hover:text-white rounded-none uppercase text-xs tracking-widest px-8 shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Quick View
                  </Button>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="font-serif text-lg font-normal">{product.name}</h3>
                <p className="font-sans text-xs text-neutral-500 uppercase tracking-wider">{product.description}</p>
                <p className="font-sans text-sm font-medium mt-2">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="outline" className="rounded-none border-black px-10 py-6 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
