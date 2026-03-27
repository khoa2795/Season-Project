"use client";
import Link from "next/link";
import { Menu, Search, Heart, User, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-season-gray transition-transform duration-300 ease-in-out ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu */}
        <div className="flex items-center space-x-2 cursor-pointer flex-1 group">
          <Menu className="w-5 h-5 text-black stroke-[1.5]" />
          <span className="font-sans text-xs uppercase tracking-widest group-hover:opacity-70 transition-opacity duration-300">
            Menu
          </span>
        </div>

        {/* Center: Logo */}
        <div className="flex flex-col items-center justify-center flex-1">
          <Link
            href="/"
            className="text-2xl tracking-mega font-light uppercase font-serif text-black hover:opacity-80 transition-opacity duration-300"
          >
            Season
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-end space-x-6 flex-1 text-black">
          <button
            aria-label="Search"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            aria-label="Favorites"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            aria-label="Account"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            <User className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            aria-label="Cart"
            className="hover:opacity-60 transition-opacity duration-300"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </nav>
    </header>
  );
}
