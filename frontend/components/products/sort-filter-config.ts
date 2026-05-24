"use client";

import {
  FrameMaterialEnum,
  FrameSizeEnum,
  ProductTypeEnum,
} from "@/lib/enums";
import type {
  FilterConfigKey,
  ProductSortValue,
} from "@/lib/model/misc";

export type SortOption = {
  label: string;
  value: ProductSortValue;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterGroup = {
  key: "frameType" | "frameSize";
  label: string;
  options: FilterOption[];
};

export const SORT_OPTIONS: SortOption[] = [
  { label: "A - Z", value: "title-asc" },
  { label: "Z - A", value: "title-desc" },
  { label: "Highest To Lowest", value: "price-desc" },
  { label: "Lowest To Highest", value: "price-asc" },
];

export const FILTER_CONFIG: Record<FilterConfigKey, FilterGroup[]> = {
  [ProductTypeEnum.eyeglasses]: [
    {
      key: "frameType",
      label: "Frame Type",
      options: [
        { label: "Acetate", value: FrameMaterialEnum.Acetate },
        { label: "Metal", value: FrameMaterialEnum.Metal },
      ],
    },
    {
      key: "frameSize",
      label: "Frame Size",
      options: [
        { label: "Small", value: FrameSizeEnum.Small },
        { label: "Medium", value: FrameSizeEnum.Medium },
        { label: "Big", value: FrameSizeEnum.Big },
      ],
    },
  ],
  [ProductTypeEnum.sunglasses]: [
    {
      key: "frameType",
      label: "Frame Type",
      options: [
        { label: "Acetate", value: FrameMaterialEnum.Acetate },
        { label: "Metal", value: FrameMaterialEnum.Metal },
      ],
    },
    {
      key: "frameSize",
      label: "Frame Size",
      options: [
        { label: "Small", value: FrameSizeEnum.Small },
        { label: "Medium", value: FrameSizeEnum.Medium },
        { label: "Big", value: FrameSizeEnum.Big },
      ],
    },
  ],
  collections: [
    {
      key: "frameType",
      label: "Frame Type",
      options: [
        { label: "Acetate", value: FrameMaterialEnum.Acetate },
        { label: "Metal", value: FrameMaterialEnum.Metal },
      ],
    },
    {
      key: "frameSize",
      label: "Frame Size",
      options: [
        { label: "Small", value: FrameSizeEnum.Small },
        { label: "Medium", value: FrameSizeEnum.Medium },
        { label: "Big", value: FrameSizeEnum.Big },
      ],
    },
  ],
};
