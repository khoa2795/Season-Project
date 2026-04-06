import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-season-footer text-neutral-400 py-16 text-sm font-sans tracking-wide">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="text-xl font-serif text-white uppercase tracking-mega">Season</Link>
          <p className="text-xs leading-relaxed max-w-xs">
            Luxury eyewear defined by timeless design and uncompromising quality. Based in New York.
          </p>
          <div className="flex space-x-4 pt-4">
            <a href="#" className="hover:text-white transition-colors duration-300">
              <Facebook className="w-4 h-4 stroke-[1.5]" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              <Twitter className="w-4 h-4 stroke-[1.5]" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              <Instagram className="w-4 h-4 stroke-[1.5]" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              <Linkedin className="w-4 h-4 stroke-[1.5]" />
            </a>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-semibold border-b border-season-border pb-2 inline-block">Explore</h4>
          <ul className="space-y-3 text-xs">
            <li><Link href="#" className="hover:text-white transition-colors duration-300">New Arrivals</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Best Sellers</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Optical</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Sunglasses</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Lookbook</Link></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-semibold border-b border-season-border pb-2 inline-block">Support</h4>
          <ul className="space-y-3 text-xs">
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">FAQ</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Shipping & Returns</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Store Locator</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors duration-300">Care Guide</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter (Mini) */}
        <div>
           <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-semibold border-b border-season-border pb-2 inline-block">Stay Connected</h4>
           <p className="text-xs mb-4">Join our community for exclusive access.</p>
           {/* Simple form as placeholder or duplicate logic */}
           <form className="flex border-b border-neutral-700 pb-1">
             <input type="email" placeholder="Email" className="bg-transparent w-full text-xs focus:outline-none placeholder:text-neutral-600 text-white" />
             <button type="submit" className="text-xs uppercase tracking-widest hover:text-white transition-colors duration-300">Join</button>
           </form>
        </div>

      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-season-border text-center text-xs text-neutral-600">
        <p>&copy; {new Date().getFullYear()} Season Eyewear. All rights reserved.</p>
      </div>
    </footer>
  );
}
