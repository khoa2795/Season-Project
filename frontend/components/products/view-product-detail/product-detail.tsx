"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { Bookmark, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { notifyCartUpdated } from "@/lib/cart/cart-sync";
import {
  deserializeProductRecord,
  type SerializedProductRecord,
} from "../utils";
import {
  buildProductFacts,
  formatDisplayName,
  getVariantStartIndex,
  humanizeLabel,
  inferColorSwatch,
  splitDescription,
  type AccordionSection,
} from "./utils";
import { RelatedProductGrid } from "./related-product-grid";
import { addVariantToGuestCart } from "@/lib/cart/cart-api";

type ProductDetailViewProps = {
  product: SerializedProductRecord;
  relatedProducts?: SerializedProductRecord[];
  collectionSlug?: string;
};

type AccordionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
};

function ProductAccordion({
  title,
  isOpen,
  onToggle,
  children,
  className,
}: AccordionProps) {
  return (
    <section className={cn("border-b border-black/12", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
        onClick={onToggle}
      >
        <span className="font-afacad text-[16px] font-semibold uppercase leading-[1.2] tracking-[0.8px] text-black">
          {title}
        </span>
        {isOpen ? (
          <Minus className="size-5 shrink-0 text-black/45" />
        ) : (
          <Plus className="size-5 shrink-0 text-black/45" />
        )}
      </button>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

function isDuplicateCartItemError(message: string, status?: number): boolean {
  return status === 409 && message.trim() === "Product already added to cart";
}

function readApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | {
          message?: string;
          error?: {
            message?: string;
          };
        }
      | undefined;

    return (
      responseData?.error?.message ??
      responseData?.message ??
      "Could not add item to cart"
    );
  }

  return error instanceof Error ? error.message : "Could not add item to cart";
}

export function ProductDetailView({
  product,
  relatedProducts = [],
  collectionSlug,
}: ProductDetailViewProps) {
  const hydratedProduct = useMemo(
    () => deserializeProductRecord(product),
    [product],
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(() =>
    getVariantStartIndex(hydratedProduct),
  );
  const [openSection, setOpenSection] = useState<AccordionSection | null>(
    "description",
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const selectedVariant =
    hydratedProduct.variants[selectedVariantIndex] ??
    hydratedProduct.defaultVariant ??
    hydratedProduct.variants[0];
  const variantImages = (selectedVariant?.images ?? []).filter(
    (image) => image !== "",
  );
  const fallbackImages = hydratedProduct.variants
    .flatMap((variant) => variant.images)
    .filter((image) => image !== "");
  const sizeImage = hydratedProduct.sizeGuideImage ?? "";
  const galleryImages =
    variantImages.length > 0 ? variantImages : fallbackImages;
  const selectedColor = humanizeLabel(selectedVariant?.color);
  const productFacts = buildProductFacts(hydratedProduct);
  const descriptionParagraphs = splitDescription(hydratedProduct.description);
  const displayName = formatDisplayName(hydratedProduct.name);
  const canAddToCart =
    selectedVariant !== undefined && isAddingToCart === false;

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateActiveSlide = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    };

    updateActiveSlide();
    carouselApi.on("select", updateActiveSlide);
    carouselApi.on("reInit", updateActiveSlide);

    return () => {
      carouselApi.off("select", updateActiveSlide);
      carouselApi.off("reInit", updateActiveSlide);
    };
  }, [carouselApi]);

  const toggleSection = (section: AccordionSection) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const handleAddToCart = async () => {
    if (selectedVariant === undefined || isAddingToCart === true) {
      return;
    }

    setIsAddingToCart(true);

    try {
      await addVariantToGuestCart(selectedVariant.sku);
      toast.success(displayName.replace(/\n/g, " "), {
        eyebrow: "ĐÃ THÊM VÀO GIỎ HÀNG THÀNH CÔNG",
        caption: selectedColor,
        imageSrc: selectedVariant.images[0] ?? "",
        duration: 4200,
      });
      notifyCartUpdated();
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const message = readApiErrorMessage(error);

      if (isDuplicateCartItemError(message, status)) {
        toast.error("Product already added to cart");
      } else {
        toast.error("Unable to add to cart", {
          description: message,
        });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderSummary = (className?: string) => (
    <div className={cn("space-y-7", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="whitespace-pre-line font-seesans text-[24px] font-normal uppercase tracking-[-0.05em] text-black">
            {displayName}
          </h1>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-0.5 size-6 shrink-0 rounded-none border-0 bg-transparent p-0 text-black hover:bg-transparent hover:text-black/70"
        >
          <Bookmark className="size-5 stroke-[1.75]" />
        </Button>
      </div>

      <div className="space-y-4 font-afacad font-normal">
        <div className="space-y-4">
          <p className="text-[16px] font-normal text-black">Colors Available</p>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] text-black/42">{selectedColor}</p>
            <div className="flex flex-wrap justify-end gap-2.5">
              {hydratedProduct.variants.map((variant, index) => {
                const variantLabel = humanizeLabel(variant.color);
                const isActive = index === selectedVariantIndex;

                return (
                  <button
                    key={variant.sku}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`Select ${variantLabel}`}
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full border p-0.5 transition-all duration-200",
                      isActive
                        ? "border-black"
                        : "border-transparent hover:border-black/25",
                    )}
                    onClick={() => {
                      setActiveSlide(0);
                      setSelectedVariantIndex(index);
                    }}
                  >
                    <span
                      className="block size-full rounded-full border border-black/10"
                      style={{
                        backgroundColor: inferColorSwatch(variantLabel, index),
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {hydratedProduct.isOnSale ? (
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/35 line-through">
            {hydratedProduct.originalPrice.toLocaleString("vi-VN")} VND
          </p>
        ) : null}

        <button
          type="button"
          disabled={canAddToCart === false}
          className="flex w-full items-center justify-between bg-[#111111] px-5 py-5 text-[15px] font-normal uppercase tracking-normal text-white transition-colors duration-200 hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/60"
          onClick={() => {
            void handleAddToCart();
          }}
        >
          <span>{isAddingToCart ? "Adding to cart..." : "Add to cart"}</span>
          <span>
            + {selectedVariant?.price.toLocaleString("vi-VN") ?? "0"} VND
          </span>
        </button>
      </div>
    </div>
  );

  const renderAccordionContent = (section: AccordionSection) => {
    if (section === "description") {
      return (
        <div className="space-y-5 font-afacad text-[15px] leading-[1.65] text-black/70">
          {descriptionParagraphs.map((paragraph, index) => (
            <p key={`${hydratedProduct.id}-description-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>
      );
    }

    if (section === "details") {
      return (
        <div className="space-y-5 font-afacad text-[14px] leading-[1.55] text-black/68">
          <dl className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-5 gap-y-3">
            <dt className="text-black/42">Brand</dt>
            <dd>{hydratedProduct.brand}</dd>
            <dt className="text-black/42">Color</dt>
            <dd>{selectedColor}</dd>
            <dt className="text-black/42">Frame</dt>
            <dd>{productFacts.join(" / ")}</dd>
            {selectedSku !== "" ? (
              <>
                <dt className="text-black/42">SKU</dt>
                <dd>{selectedSku}</dd>
              </>
            ) : null}
          </dl>

          {sizeImage !== "" ? (
            <div className="overflow-hidden bg-white/60">
              <Image
                src={sizeImage}
                alt={`${hydratedProduct.name} size guide`}
                width={1200}
                height={900}
                className="h-auto w-full"
                sizes="(max-width: 767px) calc(100vw - 40px), 420px"
              />
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="space-y-4 font-afacad text-[15px] leading-[1.65] text-black/70">
        <p>
          Đơn hàng được xử lý theo chính sách vận chuyển hiện tại của cửa hàng.
          Thời gian giao hàng phụ thuộc vào địa chỉ nhận hàng và tình trạng sản
          phẩm.
        </p>
        <p>
          Sản phẩm có thể được hỗ trợ đổi trả theo điều kiện sử dụng thực tế và
          quy định bảo hành tại thời điểm mua hàng.
        </p>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f1f1f1] pb-16 text-[#1d1b18] md:pb-24">
      <div className="mx-auto grid max-w-[1680px] gap-10 px-4 pt-6 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] md:gap-10 md:px-8 md:pt-10 lg:px-12 xl:px-16">
        <section className="grid gap-2 md:grid-cols-2 md:gap-3">
          {galleryImages.length > 0 ? (
            galleryImages.map((image, imageIndex) => (
              <div
                key={`${selectedVariant?.sku ?? hydratedProduct.id}-${imageIndex}`}
                className={cn(
                  "relative aspect-[4/5] overflow-hidden bg-[#ededed]",
                  galleryImages.length === 1 ? "md:col-span-2" : "",
                )}
              >
                <Image
                  src={image}
                  alt={`${hydratedProduct.name} ${imageIndex + 1}`}
                  fill
                  priority={imageIndex === 0}
                  className="object-contain"
                  sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) 34vw, 520px"
                />
              </div>
            ))
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center bg-white/45 font-afacad text-sm text-black/45 md:col-span-2">
              No gallery images available
            </div>
          )}
        </section>

        <aside className="md:sticky md:top-24 md:h-fit">
          <div className="space-y-8 font-afacad">
            <div className="space-y-4">
              <h1 className="whitespace-pre-line font-seesans text-[26px] font-normal uppercase leading-[0.96] tracking-[0.02em] text-black md:text-[32px]">
                {displayName}
              </h1>

              <div className="space-y-1.5">
                {hydratedProduct.isOnSale === true ? (
                  <p className="text-[13px] uppercase tracking-[0.16em] text-black/35 line-through">
                    {hydratedProduct.originalPrice.toLocaleString("vi-VN")} VND
                  </p>
                ) : null}
                <p className="text-[18px] font-semibold uppercase tracking-[0.04em] text-black">
                  {displayPrice.toLocaleString("vi-VN")} VND
                </p>
              </div>
            </div>

            {hydratedProduct.variants.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[14px] uppercase tracking-[0.12em] text-black/52">
                    Color
                  </p>
                  <p className="text-[14px] text-black/68">{selectedColor}</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {hydratedProduct.variants.map((variant, index) => {
                    const variantLabel = humanizeLabel(variant.color);
                    const isActive = index === selectedVariantIndex;

                    return (
                      <button
                        key={`${variant.sku}-${index}`}
                        type="button"
                        aria-pressed={isActive}
                        aria-label={`Select ${variantLabel}`}
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border p-1 transition-colors duration-200",
                          isActive === true
                            ? "border-black"
                            : "border-black/12 hover:border-black/38",
                        )}
                        onClick={() => {
                          setSelectedVariantIndex(index);
                        }}
                      >
                        <span
                          className="block size-full rounded-full border border-black/10"
                          style={{
                            backgroundColor: inferColorSwatch(
                              variantLabel,
                              index,
                            ),
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {renderSummary()}

          <div>
            <ProductAccordion
              title="PRODUCTS INFORMATION"
              isOpen={openSection === "info"}
              onToggle={() => {
                toggleSection("info");
              }}
            >
              {renderAccordionContent("info")}
            </ProductAccordion>

            <ProductAccordion
              title="SIZE CHART"
              isOpen={openSection === "size"}
              onToggle={() => {
                toggleSection("size");
              }}
            >
              {renderAccordionContent("size")}
            </ProductAccordion>
          </div>
        </div>

              <ProductAccordion
                title="PRODUCTS INFORMATION"
                isOpen={openSection === "info"}
                onToggle={() => {
                  toggleSection("details");
                }}
              >
                {renderAccordionContent("details")}
              </ProductAccordion>

              <ProductAccordion
                title="SIZE CHART"
                isOpen={openSection === "size"}
                onToggle={() => {
                  toggleSection("shipping");
                }}
              >
                {renderAccordionContent("shipping")}
              </ProductAccordion>
            </div>
          </div>
        </aside>
      </div>
      <RelatedProductGrid
        products={relatedProducts}
        collectionSlug={collectionSlug}
      />
    </main>
  );
}
