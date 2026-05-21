"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { ProductTypeEnum } from "@/lib/enums";
import { fetchCollectionFilters } from "@/lib/model";
import { EyeglassesView, SunglassesView } from "@/lib/model/type";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProductCategoryConfig } from "./utils";
type ProductsCategoryShellProps = {
  category: ProductTypeEnum;
  categoryConfig: ProductCategoryConfig;
  children: ReactNode;
};

export function ProductsCategoryShell({
  category,
  categoryConfig,
  children,
}: ProductsCategoryShellProps) {
  const segments = useSelectedLayoutSegments();
  const activeSlug = segments[0];
  const activeCollectionSlug = segments[1];
  const [collectionFilters, setCollectionFilters] = useState<
    Array<{ label: string; slug: string; href: string }>
  >([]);
  const [isLoadingCollectionFilters, setIsLoadingCollectionFilters] =
    useState(false);

  const isCollectionMode =
    activeSlug === EyeglassesView.ViewByCollection ||
    activeSlug === SunglassesView.ViewByCollection;

  useEffect(() => {
    if (!isCollectionMode) {
      setCollectionFilters([]);
      setIsLoadingCollectionFilters(false);
      return;
    }

    let isCancelled = false;
    setIsLoadingCollectionFilters(true);

    const loadCollectionFilters = async () => {
      try {
        const collections = await fetchCollectionFilters(category);

        if (isCancelled) {
          return;
        }

        setCollectionFilters(
          collections.map((collection) => ({
            label: collection.name,
            slug: collection.slug,
            href: `/products/${category}/view-by-collection/${collection.slug}`,
          })),
        );
        setIsLoadingCollectionFilters(false);
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to load collection filters:", error);
          setCollectionFilters([]);
          setIsLoadingCollectionFilters(false);
        }
      }
    };

    void loadCollectionFilters();

    return () => {
      isCancelled = true;
    };
  }, [category, isCollectionMode]);

  if (categoryConfig === undefined) {
    return <>{children}</>;
  }

  const visibleFilters = isCollectionMode
    ? collectionFilters
    : categoryConfig.filters.map((filter) => ({
        label: filter.label,
        slug: filter.slug,
        href: `/products/${category}/${filter.slug}`,
      }));

  return (
    <main className="bg-[#f5f5f7] text-neutral-950">
      <section className="mx-auto flex w-full max-w-400 flex-col gap-5 px-4 py-8 md:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-neutral-500">
            <Link href="/" className="hover:text-neutral-900">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span>{categoryConfig.breadcrumb}</span>
          </div>

          <div className="flex items-center justify-between gap-3 md:items-end">
            <h1 className="text-2xl font-serif uppercase tracking-[0.18em] md:text-5xl">
              {categoryConfig.title}
            </h1>

            <Button
              variant="outline"
              className="shrink-0 rounded-full px-4 text-xs uppercase tracking-[0.2em] sm:px-5 md:text-sm md:tracking-[0.22em]"
            >
              Sort & Filter
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <ScrollArea className="w-full whitespace-nowrap">
            {isCollectionMode && isLoadingCollectionFilters ? (
              <div className="flex min-w-max items-center gap-1">
                <span className="border-b-2 border-transparent px-4 py-3 text-sm uppercase tracking-[0.2em] text-neutral-400">
                  Loading Collections...
                </span>
              </div>
            ) : (
              <div className="flex min-w-max items-center gap-1">
                {visibleFilters.map((filter) => {
                  const isActive = isCollectionMode
                    ? activeCollectionSlug === filter.slug
                    : activeSlug === filter.slug;

                  return (
                    <Link
                      key={filter.slug}
                      href={filter.href}
                      className={[
                        "border-b-2 px-4 py-3 text-sm uppercase tracking-[0.2em] transition-colors",
                        isActive
                          ? "border-neutral-900 text-neutral-950"
                          : "border-transparent text-neutral-500 hover:text-neutral-900",
                      ].join(" ")}
                    >
                      {filter.label}
                    </Link>
                  );
                })}
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="mt-2">{children}</div>
        </div>
      </section>
    </main>
  );
}
