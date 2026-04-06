/**
 * Mega Menu Content - Simplified Dark Menu
 * Dark background (#202126) with clean, minimal layout
 */
'use client';

import { X } from 'lucide-react';
import { menuConfig } from './menuConfig';
import { MenuItem } from './MenuItem';

interface MegaMenuContentProps {
  onClose: () => void;
}

export function MegaMenuContent({ onClose }: MegaMenuContentProps) {
  return (
    <div className="h-full flex flex-col bg-season-menu-bg">
      {/* Header - Season brand name (mimic Footer style) */}
      <div className="sticky top-0 border-b border-neutral-700 bg-season-menu-bg px-4 sm:px-8 py-6 sm:py-8 z-10 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-serif text-white uppercase tracking-mega">Season</h2>
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 rounded p-2"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Content - Scrollable with 3-column grid layout */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-8 py-6 sm:py-8">
          {menuConfig.map((category) => (
            <div 
              key={category.name} 
              className="space-y-4 sm:space-y-6"
            >
              {/* Category Title - Luxurious Yellow */}
              <h3 className="text-xs sm:text-lg font-light tracking-wide text-season-luxury-yellow uppercase">
                {category.name}
              </h3>

              {/* All items together without section titles */}
              <ul className="space-y-3">
                {category.sections.map((section) =>
                  section.items.map((item) => (
                    <li key={item.href}>
                      <MenuItem
                        {...item}
                        onItemClick={onClose}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-700 bg-season-menu-bg px-4 sm:px-8 py-4 sm:py-6">
        <p className="text-xs text-neutral-600 tracking-wide">
          © {new Date().getFullYear()} Season. All rights reserved.
        </p>
      </div>
    </div>
  );
}

