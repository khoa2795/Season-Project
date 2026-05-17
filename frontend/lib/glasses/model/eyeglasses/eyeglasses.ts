import {
  FrameMaterialEnum,
  FrameSizeEnum,
  ProductTypeEnum,
} from "../../../enums";
import type {
  FrameMaterial,
  FrameSize,
  ProductAvailability,
  ProductGender,
} from "../../type";
import { getAvailabilityOrDefault, ProductVariant, Rating } from "../shared";

export interface EyeglassesSpecificationsArgs {
  gender: ProductGender;
  frameType: FrameType;
}

export class FrameType {
  material: FrameMaterial;
  size: FrameSize;

  constructor(args: { material: FrameMaterial; size: FrameSize }) {
    this.material = args.material;
    this.size = args.size;
  }

  static deser(data: any): FrameType {
    return new FrameType({
      material: data?.material ?? FrameMaterialEnum.Acetate,
      size: data?.size ?? FrameSizeEnum.Medium,
    });
  }
}

export class EyeglassesSpecifications {
  gender: ProductGender;
  frameType: FrameType;

  constructor(args: EyeglassesSpecificationsArgs) {
    this.gender = args.gender;
    this.frameType = args.frameType;
  }

  static deser(data: any): EyeglassesSpecifications {
    return new EyeglassesSpecifications({
      gender: data?.gender,
      frameType: FrameType.deser(data?.frameType),
    });
  }
}

export interface EyeglassesProductArgs {
  type: ProductTypeEnum.Eyeglasses;
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  brand: string;
  salePercent: number;
  availability: ProductAvailability;
  description: string;
  variants: ProductVariant[];
  rating: Rating;
  isActive: boolean;
  specifications: EyeglassesSpecifications;
}

export class EyeglassesProduct {
  id: string;
  name: string;
  slug: string;
  type: ProductTypeEnum.Eyeglasses;
  collectionId: string;
  brand: string;
  salePercent: number;
  availability: ProductAvailability;
  description: string;
  variants: ProductVariant[];
  rating: Rating;
  isActive: boolean;
  specifications: EyeglassesSpecifications;

  constructor(args: EyeglassesProductArgs) {
    this.id = args.id;
    this.name = args.name;
    this.slug = args.slug;
    this.type = args.type;
    this.collectionId = args.collectionId;
    this.brand = args.brand;
    this.salePercent = args.salePercent;
    this.availability = args.availability;
    this.description = args.description;
    this.variants = args.variants;
    this.rating = args.rating;
    this.isActive = args.isActive;
    this.specifications = args.specifications;
  }

  // Converts the raw backend DTO into a frontend model instance.
  static deser(data: any): EyeglassesProduct {
    return new EyeglassesProduct({
      id: data.id,
      name: data.name,
      slug: data.slug,
      type: data.type ?? ProductTypeEnum.Eyeglasses,
      collectionId: data.collectionId,
      brand: data.brand,
      salePercent: data.salePercent ?? 0,
      availability: getAvailabilityOrDefault(data.availability),
      description: data.description,
      specifications: EyeglassesSpecifications.deser(data.specifications),
      variants: (data.variants ?? []).map((variant: any) =>
        ProductVariant.deser(variant),
      ),
      rating: Rating.deser(data.rating),
      isActive: data.isActive,
    });
  }

  get defaultVariant(): ProductVariant | undefined {
    return (
      this.variants.find((variant) => variant.isDefault) ?? this.variants[0]
    );
  }

  get primaryImage(): string {
    return this.defaultVariant?.images[0] ?? "";
  }

  get price(): number {
    return this.defaultVariant?.price ?? 0;
  }

  get originalPrice(): number {
    if (this.salePercent <= 0) {
      return this.price;
    }

    return Math.round(this.price / (1 - this.salePercent / 100));
  }

  get isOnSale(): boolean {
    return this.salePercent > 0;
  }

  get frameMaterial(): FrameMaterial {
    return this.specifications.frameType.material;
  }

  get frameSize(): FrameSize {
    return this.specifications.frameType.size;
  }
}
