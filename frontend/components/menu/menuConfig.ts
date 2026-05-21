import { MenuCategory } from "./types";

export const menuConfig: MenuCategory[] = [
  {
    name: "Eyeglasses",
    sections: [
      {
        items: [
          { label: "Men Eyeglasses", href: "/products/eyeglasses/men" },
          { label: "Women Eyeglasses", href: "/products/eyeglasses/women" },
        ],
      },
      {
        items: [
          {
            label: "View All Eyeglasses",
            href: "/products/eyeglasses/view-all",
          },
          {
            label: "View By Collections",
            href: "/products/eyeglasses/view-by-collection",
          },
        ],
      },
    ],
  },

  {
    name: "Sunglasses",
    sections: [
      {
        items: [
          { label: "Men Sunglasses", href: "/products/sunglasses/men" },
          { label: "Women Sunglasses", href: "/products/sunglasses/women" },
        ],
      },
      {
        items: [
          {
            label: "View All Sunglasses",
            href: "/products/sunglasses/view-all",
          },
          {
            label: "View By Collections",
            href: "/products/sunglasses/view-by-collection",
          },
        ],
      },
    ],
  },

  {
    name: "Support",
    sections: [
      {
        items: [
          { label: "Contact Us", href: "/support/contact" },
          { label: "FAQ", href: "/support/faq" },
          { label: "Shipping & Returns", href: "/support/shipping" },
          { label: "Store Locator", href: "/support/locations" },
          { label: "Care Guide", href: "/support/care" },
        ],
      },
    ],
  },
];
