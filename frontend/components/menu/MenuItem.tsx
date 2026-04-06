/**
 * Individual menu item component
 * Dark theme styling for #202126 menu background
 */
import Link from 'next/link';
import { MenuItem as MenuItemType } from './types';
import { cn } from '@/lib/utils';

interface MenuItemProps extends MenuItemType {
  onItemClick?: () => void;
  className?: string;
}

export function MenuItem({ 
  label, 
  href, 
  icon, 
  onItemClick,
  className,
  isSale,
  badge
}: MenuItemProps) {
  // Determine text color based on badge type
  const getTextColor = () => {
    if (isSale) return 'text-season-sale-red';
    if (badge === 'bestseller') return 'text-yellow-400';
    if (badge === 'viewall') return 'text-neutral-400';
    return 'text-neutral-300';
  };

  const getHoverColor = () => {
    if (isSale) return 'hover:text-season-sale-red';
    if (badge === 'bestseller') return 'hover:text-yellow-300';
    if (badge === 'viewall') return 'hover:text-neutral-300';
    return 'hover:text-white';
  };

  const getHoverBg = () => {
    if (badge === 'viewall') return 'hover:bg-neutral-700';
    return 'hover:bg-neutral-800';
  };

  return (
    <Link
      href={href}
      onClick={onItemClick}
      className={cn(
        // Base styles
        "group block px-3 py-2 rounded transition-all duration-200",
        // Text styling - Light text for dark background
        "text-xs sm:text-base font-light",
        getTextColor(),
        // Hover states - Light up on hover
        getHoverColor(),
        getHoverBg(),
        // Focus states - Accessibility
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-600 focus-visible:ring-offset-1 focus-visible:ring-offset-season-menu-bg",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className={cn("transition-colors", isSale ? "text-season-sale-red" : badge === 'bestseller' ? 'text-yellow-400' : badge === 'viewall' ? 'text-neutral-400' : "text-neutral-500 group-hover:text-neutral-200")}>{icon}</span>}
          <span>{label}</span>
        </div>
        {/* Arrow indicator - Appears on hover */}
        <span className={cn("ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200", isSale ? "text-season-sale-red" : badge === 'bestseller' ? 'text-yellow-400' : badge === 'viewall' ? 'text-neutral-400' : "text-neutral-600 group-hover:text-neutral-400")}>
          →
        </span>
      </div>
    </Link>
  );
}
