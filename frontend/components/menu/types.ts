/**
 * Type definitions for Mega Menu Drawer
 */

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isSale?: boolean;  // Optional flag for sale items (red)
  badge?: 'bestseller' | 'viewall';  // Optional badge type for different styling
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuCategory {
  name: string;
  href?: string;
  sections: MenuSection[];
  featuredImage?: {
    src: string;
    alt: string;
    caption?: string;  // NEW: Optional caption
  };
}

export interface MegaMenuContextType {
  isOpen: boolean;
  toggleOpen: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}
