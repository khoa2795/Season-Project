import { ProductGrid } from "@/components/products/products-grid";
import { toProductCards, hydrateProducts } from "@/components/products/utils";
import { searchProducts } from "@/lib/model";
import { getSingleSearchParam } from "@/app/utils/search-params";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const queryParams = await searchParams;
  const q = getSingleSearchParam(queryParams.q)?.trim() ?? "";

  if (q.length < 2) {
    return (
      <main className="bg-[#f5f5f7] text-neutral-950">
        <section className="mx-auto flex min-h-[50vh] w-full max-w-400 flex-col gap-6 px-4 py-8 md:px-8 lg:px-10 lg:py-10">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
            Product Search
          </p>
          <h1 className="font-serif text-3xl uppercase tracking-[0.08em] text-black md:text-5xl">
            Search products
          </h1>
          <p className="max-w-xl text-base text-neutral-600">
            Use the search icon in the header and enter at least 2 characters to
            find products.
          </p>
        </section>
      </main>
    );
  }

  const data = await searchProducts(q, 0, 12);
  const products = toProductCards(hydrateProducts(data.records));

  return (
    <main className="bg-[#f5f5f7] text-neutral-950">
      <section className="mx-auto flex w-full max-w-400 flex-col gap-8 px-4 py-8 md:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
            Product Search
          </p>
          <h1 className="font-serif text-3xl uppercase tracking-[0.08em] text-black md:text-5xl">
            Results for &quot;{q}&quot;
          </h1>
          <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
            {data.total} products found
          </p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex min-h-64 items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 px-6 text-center">
            <p className="max-w text-sm uppercase tracking-[0.16em] text-neutral-500">
              No products matched your search. Try another keyword or a simpler
              spelling.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
