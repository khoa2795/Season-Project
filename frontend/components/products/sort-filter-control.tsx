"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  parseProductsQueryState,
  type FilterConfigKey,
  type ProductsQueryState,
} from "@/lib/model/misc";
import { FILTER_CONFIG, SORT_OPTIONS } from "./sort-filter-config";
import { DEFAULT_PRODUCT_SORT as FALLBACK_SORT } from "@/lib/model/misc";

type SortFilterControlProps = {
  filterConfigKey: FilterConfigKey;
  onApplyingQueryChange?: (isApplying: boolean) => void;
};

export function SortFilterControl({
  filterConfigKey,
  onApplyingQueryChange,
}: SortFilterControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") ?? undefined;
  const frameTypeParam = searchParams.get("frameType") ?? undefined;
  const frameSizeParam = searchParams.get("frameSize") ?? undefined;
  const queryState = useMemo(
    () =>
      parseProductsQueryState({
        sort: sortParam,
        frameType: frameTypeParam,
        frameSize: frameSizeParam,
      }),
    [sortParam, frameTypeParam, frameSizeParam],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isApplyingQuery, startTransition] = useTransition();
  const [draftQueryState, setDraftQueryState] =
    useState<ProductsQueryState>(queryState);
  const filterGroups = FILTER_CONFIG[filterConfigKey];
  const hasFilters = filterGroups.length > 0;

  useEffect(() => {
    setDraftQueryState(queryState);
  }, [queryState]);

  useEffect(() => {
    onApplyingQueryChange?.(isApplyingQuery);
  }, [isApplyingQuery, onApplyingQueryChange]);

  const handleSortSelect = (sort: ProductsQueryState["sort"]) => {
    setDraftQueryState({
      ...draftQueryState,
      sort,
    });
  };

  const handleFilterSelect = (
    key: "frameType" | "frameSize",
    value: string,
  ) => {
    const currentValue = draftQueryState[key];

    setDraftQueryState({
      ...draftQueryState,
      [key]: currentValue === value ? null : value,
    } as ProductsQueryState);
  };

  const handleApply = () => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (draftQueryState.sort !== FALLBACK_SORT) {
      nextSearchParams.set("sort", draftQueryState.sort);
    } else {
      nextSearchParams.delete("sort");
    }

    if (draftQueryState.frameType !== null) {
      nextSearchParams.set("frameType", draftQueryState.frameType);
    } else {
      nextSearchParams.delete("frameType");
    }

    if (draftQueryState.frameSize !== null) {
      nextSearchParams.set("frameSize", draftQueryState.frameSize);
    } else {
      nextSearchParams.delete("frameSize");
    }

    startTransition(() => {
      const nextQuery = nextSearchParams.toString();

      router.replace(nextQuery === "" ? pathname : `${pathname}?${nextQuery}`, {
        scroll: false,
      });
    });

    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-11 rounded-full border-[#d9d5cf] bg-white px-5 text-[13px] font-serif uppercase tracking-[0.24em] text-neutral-950 hover:bg-white"
        >
          <SlidersHorizontal className="size-4" />
          Sort & Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={14}
        className="w-[min(92vw,26rem)] rounded-[1.6rem] border border-[#ded9d2] bg-[#fbfaf8] p-6 text-neutral-950 shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-[1.15rem] font-serif text-neutral-950">
              Sort By
            </h3>

            <div className="flex flex-wrap gap-3">
              {SORT_OPTIONS.map((option) => {
                const isSelected = draftQueryState.sort === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-serif tracking-[0.08em] transition-colors",
                      isSelected
                        ? "border-neutral-950 bg-white text-neutral-950"
                        : "border-[#ddd8d1] bg-white text-neutral-700 hover:border-neutral-950",
                    )}
                    onClick={() => {
                      handleSortSelect(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {hasFilters ? (
            <>
              <Separator className="bg-[#ddd8d1]" />
              <div className="flex flex-col gap-5">
                <h3 className="text-[1.15rem] font-serif text-neutral-950">
                  Filter By
                </h3>

                {filterGroups.map((group) => (
                  <div key={group.key} className="flex flex-col gap-3">
                    <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
                      {group.label}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {group.options.map((option) => {
                        const isSelected =
                          draftQueryState[group.key] === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm font-serif tracking-[0.08em] transition-colors",
                              isSelected
                                ? "border-neutral-950 bg-white text-neutral-950"
                                : "border-[#ddd8d1] bg-white text-neutral-700 hover:border-neutral-950",
                            )}
                            onClick={() => {
                              handleFilterSelect(group.key, option.value);
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <DropdownMenuSeparator className="bg-[#ddd8d1]" />

          <Button
            className="h-11 rounded-full bg-neutral-950 px-6 text-[12px] uppercase tracking-[0.22em] text-white hover:bg-neutral-800"
            disabled={isApplyingQuery}
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
