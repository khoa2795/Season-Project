import { toPlainObject } from "@/lib/model/misc";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/view-product-detail/product-detail";
import { fetchProductById } from "@/lib/model";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductsPage({
  params,
}: ProductPageProps) {
  const { productId } = await params;

  let product;

  try {
    product = await fetchProductById(productId);
  } catch {
    console.error(`Failed to fetch product with id ${productId}`);
    notFound();
  }

  return <ProductDetailView product={toPlainObject(product)} />;
}
