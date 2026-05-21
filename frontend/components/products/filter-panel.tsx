"use client";

import { ProductTypeEnum, FrameMaterialEnum, FrameSizeEnum } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Layers, Maximize2, Tag } from "lucide-react";

export type FilterState = {
  frameType?: FrameMaterialEnum | null;
  frameSize?: FrameSizeEnum | null;
  collectionSlug?: string | null;
  sale?: boolean;
};

type FilterPanelProps = {
  category: ProductTypeEnum;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  collections?: Array<{ slug: string; name: string }>;
};

export function FilterPanel({
  category,
  filters,
  onFilterChange,
  collections = [],
}: FilterPanelProps) {
  const handleToggleSale = () => {
    onFilterChange({
      ...filters,
      sale: filters.sale === true ? false : true,
    });
  };

  const handleFrameTypeChange = (frameType: FrameMaterialEnum | null) => {
    onFilterChange({
      ...filters,
      frameType: filters.frameType === frameType ? null : frameType,
    });
  };

  const handleFrameSizeChange = (frameSize: FrameSizeEnum | null) => {
    onFilterChange({
      ...filters,
      frameSize: filters.frameSize === frameSize ? null : frameSize,
    });
  };

  const handleCollectionChange = (slug: string | null) => {
    onFilterChange({
      ...filters,
      collectionSlug: filters.collectionSlug === slug ? null : slug,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      frameType: null,
      frameSize: null,
      collectionSlug: null,
      sale: false,
    });
  };

  const hasActiveFilters =
    filters.frameType !== undefined ||
    filters.frameSize !== undefined ||
    filters.collectionSlug !== undefined ||
    filters.sale === true;

  const activeFilterCount = [
    filters.frameType !== undefined ? 1 : 0,
    filters.frameSize !== undefined ? 1 : 0,
    filters.collectionSlug !== undefined ? 1 : 0,
    filters.sale === true ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const FilterCheckbox = ({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) => (
    <label className="group flex items-center gap-3 cursor-pointer transition-all duration-200">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute opacity-0 w-4 h-4 cursor-pointer"
        />
        <div
          className={`w-4 h-4 rounded border-2 transition-all duration-300 ${
            checked
              ? "bg-neutral-900 border-neutral-900 shadow-md"
              : "border-neutral-300 bg-white group-hover:border-neutral-500"
          }`}
        >
          {checked && <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>}
        </div>
      </div>
      <span
        className={`text-xs font-medium tracking-[0.12em] transition-colors duration-300 ${
          checked ? "text-neutral-900 font-semibold" : "text-neutral-600 group-hover:text-neutral-900"
        }`}
      >
        {label}
      </span>
    </label>
  );

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-neutral-900 to-neutral-600 rounded-full" />
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-900">Filters</h3>
          {hasActiveFilters === true && activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-neutral-900 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters === true && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto gap-1.5 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-all duration-200"
          >
            <X className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Sale Filter - Available for both */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="size-4 text-neutral-600" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Special Offers</p>
        </div>
        <div className="pl-6 space-y-2">
          <FilterCheckbox
            checked={filters.sale === true}
            label="Sale Items Only"
            onChange={handleToggleSale}
          />
        </div>
      </div>

      {/* Eyeglasses Specific Filters */}
      {category === ProductTypeEnum.eyeglasses && (
        <>
          {/* Frame Material Filter */}
          <div className="space-y-3 border-t border-neutral-200 pt-5">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-neutral-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Material</p>
            </div>
            <div className="pl-6 space-y-2.5">
              {[FrameMaterialEnum.Acetate, FrameMaterialEnum.Metal].map((material) => (
                <FilterCheckbox
                  key={material}
                  checked={filters.frameType === material}
                  label={material}
                  onChange={() => {
                    handleFrameTypeChange(material);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Frame Size Filter */}
          <div className="space-y-3 border-t border-neutral-200 pt-5">
            <div className="flex items-center gap-2">
              <Maximize2 className="size-4 text-neutral-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Size</p>
            </div>
            <div className="pl-6 space-y-2.5">
              {[FrameSizeEnum.Small, FrameSizeEnum.Medium, FrameSizeEnum.Big].map((size) => (
                <FilterCheckbox
                  key={size}
                  checked={filters.frameSize === size}
                  label={size}
                  onChange={() => {
                    handleFrameSizeChange(size);
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Sunglasses Specific Filters */}
      {category === ProductTypeEnum.sunglasses && collections.length > 0 && (
        <div className="space-y-3 border-t border-neutral-200 pt-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-neutral-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Collection</p>
          </div>
          <div className="pl-6 space-y-2.5">
            {collections.map((collection) => (
              <FilterCheckbox
                key={collection.slug}
                checked={filters.collectionSlug === collection.slug}
                label={collection.name}
                onChange={() => {
                  handleCollectionChange(collection.slug);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
