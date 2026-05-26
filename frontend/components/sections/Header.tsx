"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Store,
  X,
  type LucideIcon,
} from "lucide-react";
import { MegaMenu } from "../menu/MegaMenu";
import { CartDrawer } from "../cart/cart-drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type HeaderActionProps = {
  label: string;
  icon: LucideIcon;
  href?: string;
  isExpanded?: boolean;
  onClick?: () => void;
};

type HeaderSearchProps = {
  isOpen: boolean;
  query: string;
  currentSearchQuery: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onQueryChange: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function HeaderAction({
  label,
  icon: Icon,
  href,
  isExpanded = false,
  onClick,
}: HeaderActionProps) {
  const className = cn(
    "group h-9 min-w-9 gap-0 overflow-hidden rounded-full border border-black/10 bg-white p-0 text-black shadow-none transition-[width,border-color,background-color] duration-300 hover:w-32 hover:border-black/24 hover:bg-[#f7f5f0] focus-visible:w-32 md:h-11 md:min-w-11 md:hover:w-36 md:focus-visible:w-36",
    isExpanded ? "w-32 border-black/24 bg-[#f7f5f0] md:w-36" : "w-9 md:w-11",
  );
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center md:size-11">
        <Icon className="size-4 stroke-[1.65] md:size-5" />
      </span>
      <span
        className={cn(
          "max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap text-left font-serif text-[11px] font-semibold uppercase tracking-[0.1em] opacity-0 transition-[max-width,padding,transform,opacity] duration-300 group-hover:max-w-20 group-hover:translate-x-0 group-hover:pr-2 group-hover:opacity-100 group-focus-visible:max-w-20 group-focus-visible:translate-x-0 group-focus-visible:pr-2 group-focus-visible:opacity-100 md:text-[13px] md:tracking-[0.12em] md:group-hover:max-w-24 md:group-hover:pr-3 md:group-focus-visible:max-w-24 md:group-focus-visible:pr-3",
          isExpanded && "max-w-20 translate-x-0 pr-2 opacity-100 md:max-w-24 md:pr-3",
        )}
      >
        {label}
      </span>
    </>
  );

  if (href !== undefined) {
    return (
      <Button asChild variant="ghost" size="icon" className={className}>
        <Link href={href} aria-label={label}>
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-expanded={isExpanded}
      className={className}
      onClick={onClick}
    >
      {content}
    </Button>
  );
}

function HeaderSearch({
  isOpen,
  query,
  currentSearchQuery,
  inputRef,
  onQueryChange,
  onOpenChange,
  onSubmit,
}: HeaderSearchProps) {
  if (isOpen === false) {
    return (
      <HeaderAction
        label="Search"
        icon={Search}
        onClick={() => {
          onQueryChange(currentSearchQuery);
          onOpenChange(true);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onBlur={(event) => {
        const nextFocusedElement = event.relatedTarget as Node | null;

        if (
          nextFocusedElement !== null &&
          event.currentTarget.contains(nextFocusedElement)
        ) {
          return;
        }

        onOpenChange(false);
      }}
      className="flex h-9 w-[min(48vw,18rem)] min-w-0 items-center rounded-full border border-black/18 bg-[#f7f5f0] pl-1 pr-1.5 text-black transition-[width,border-color,background-color] duration-300 focus-within:border-black/32 md:h-11 md:w-[min(46vw,24rem)] md:pr-2"
    >
      <button
        type="submit"
        aria-label="Search"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-black transition-opacity hover:opacity-65 md:size-10"
      >
        <Search className="size-4 stroke-[1.65] md:size-5" />
      </button>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => {
          onQueryChange(event.target.value);
        }}
        placeholder="Search products"
        aria-label="Search products"
        className="h-8 min-w-0 border-0 bg-transparent px-0 font-afacad text-[13px] text-black shadow-none placeholder:text-black/42 focus-visible:ring-0 focus-visible:ring-offset-0 md:h-10 md:text-[15px]"
      />
      <button
        type="button"
        aria-label="Clear search"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-black/62 transition-colors hover:text-black md:size-9"
        onClick={() => {
          if (query.trim() === "") {
            onOpenChange(false);
            return;
          }

          onQueryChange("");
          inputRef.current?.focus();
        }}
      >
        <X className="size-4 stroke-[1.65] md:size-4.5" />
      </button>
    </form>
  );
}

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearchQuery = searchParams.get("q") ?? "";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState(currentSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = query.trim();
    if (normalized.length < 2) {
      inputRef.current?.focus();
      return;
    }

    const params = new URLSearchParams();
    params.set("q", normalized);
    router.push(`/search?${params.toString()}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-season-gray bg-white/95 backdrop-blur-sm">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu */}
        <div className="flex-1">
          <MegaMenu />
        </div>

        {/* Center: Logo */}
        <div className="flex flex-col items-center justify-center flex-1">
          <Link
            href="/"
            className="text-1xl md:text-2xl tracking-mega font-light uppercase font-serif text-black hover:opacity-80 transition-opacity duration-300"
          >
            Season
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex flex-1 items-center justify-end gap-2 text-black md:gap-3">
          <HeaderSearch
            isOpen={isSearchOpen}
            query={query}
            currentSearchQuery={currentSearchQuery}
            inputRef={inputRef}
            onQueryChange={setQuery}
            onOpenChange={setIsSearchOpen}
            onSubmit={handleSearchSubmit}
          />
          <HeaderAction label="Visit Store" icon={Store} href="/stores" />
          <CartDrawer>
            <HeaderAction label="Cart" icon={ShoppingBag} />
          </CartDrawer>
        </div>
      </nav>
    </header>
  );
}
