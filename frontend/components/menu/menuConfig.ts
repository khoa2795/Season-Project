import { MenuCategory } from "./types";

export const menuConfig: MenuCategory[] = [
  {
    name: "Eyeglasses",
    sections: [
      {
        items: [
          { label: "View All Eyeglasses", href: "/products/eyeglasses/view-all" },
          { label: "Women Eyeglasses", href: "/products/eyeglasses/women" },
          { label: "Men Eyeglasses", href: "/products/eyeglasses/men" },
          { label: "Clearance Sale", href: "/products/eyeglasses/sale" },
        ],
      },
    ],
  },

  {
    name: "Sunglasses",
    sections: [
      {
        items: [
          { label: "View All Sunglasses", href: "/products/sunglasses/view-all" },
          { label: "Women Sunglasses", href: "/products/sunglasses/women" },
          { label: "Men Sunglasses", href: "/products/sunglasses/men" },
          { label: "Clearance Sale", href: "/products/sunglasses/sale" },
        ],
      },
    ],
  },

  {
    name: "Collections",
    sections: [
      {
        items: [
          { label: "View All", href: "/products/collections" },
          { label: "The Athletes", href: "/products/collections/the-athletes" },
          { label: "The Office", href: "/products/collections/the-office" },
          { label: "The Soap", href: "/products/collections/the-soap" },
          { label: "The Vertebra", href: "/products/collections/the-vertebra" },
          { label: "The Cut", href: "/products/collections/the-cut" },
        ],
      },
    ],
  },
];
