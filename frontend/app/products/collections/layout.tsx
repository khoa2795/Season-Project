import type { ReactNode } from "react";
import { ProductsCollectionsShell } from "@/components/products/products-collections-shell";

type CollectionsLayoutProps = {
  children: ReactNode;
};

export default function CollectionsLayout({
  children,
}: CollectionsLayoutProps) {
  return <ProductsCollectionsShell>{children}</ProductsCollectionsShell>;
}

