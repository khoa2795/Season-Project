/**
 * Mega Menu Drawer Component using shadcn Sheet
 * Manages state and renders a full-screen navigation menu
 */
'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { MegaMenuContent } from './MegaMenuContent';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="lg"
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            "text-neutral-900 hover:text-neutral-600",
            "hover:bg-neutral-100",
            isOpen && "text-neutral-600 bg-neutral-100"
          )}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-light uppercase tracking-wide">Menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="p-0 overflow-y-auto"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Browse our collection of eyewear</SheetDescription>
        <MegaMenuContent onClose={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
