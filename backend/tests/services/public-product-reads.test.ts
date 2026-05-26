import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { Collection } from "../../src/models/collection.model.js";
import { Product } from "../../src/models/product.model.js";
import { getCollectionProductsBySlug } from "../../src/services/collections.service.js";
import { searchProducts } from "../../src/services/product-search.service.js";
import { getProductById, getProductsByFilters } from "../../src/services/products.service.js";

function withPatchedProperty<T extends object, K extends keyof T>(
  target: T,
  property: K,
  value: T[K],
  run: () => Promise<void>,
): Promise<void> {
  const descriptor = Object.getOwnPropertyDescriptor(target, property);

  Object.defineProperty(target, property, {
    configurable: true,
    value,
  });

  return run().finally(() => {
    if (descriptor === undefined) {
      delete target[property];
      return;
    }

    Object.defineProperty(target, property, descriptor);
  });
}

test("getProductsByFilters only queries active in-stock products", async () => {
  let countedFilter: Record<string, unknown> | null = null;
  let foundFilter: Record<string, unknown> | null = null;

  await withPatchedProperty(
    Product,
    "countDocuments",
    (async (filter: Record<string, unknown>) => {
      countedFilter = filter;
      return 1;
    }) as typeof Product.countDocuments,
    async () => {
      await withPatchedProperty(
        Product,
        "find",
        ((filter: Record<string, unknown>) => {
          foundFilter = filter;

          return {
            select: () => ({
              sort: () => ({
                skip: () => ({
                  limit: () => ({
                    lean: async () => [],
                  }),
                }),
              }),
            }),
          };
        }) as unknown as typeof Product.find,
        async () => {
          await getProductsByFilters({
            type: null,
            frameType: null,
            frameSize: null,
            collectionSlug: null,
            gender: null,
            sale: false,
            sort: "title-asc",
            offset: 0,
            limit: 10,
          });

          assert.deepEqual(countedFilter, {
            isActive: true,
            availability: "in_stock",
          });
          assert.deepEqual(foundFilter, {
            isActive: true,
            availability: "in_stock",
          });
        },
      );
    },
  );
});

test("getProductById requires an active in-stock product", async () => {
  let foundFilter: Record<string, unknown> | null = null;
  const id = new Types.ObjectId().toString();

  await withPatchedProperty(
    Product,
    "findOne",
    ((filter: Record<string, unknown>) => {
      foundFilter = filter;

      return {
        select: () => ({
          lean: async () => null,
        }),
      };
    }) as unknown as typeof Product.findOne,
    async () => {
      const result = await getProductById(id);

      assert.equal(result, null);
      assert.deepEqual(foundFilter, {
        _id: id,
        isActive: true,
        availability: "in_stock",
      });
    },
  );
});

test("searchProducts filters the post-search match to active in-stock products", async () => {
  const pipelines: unknown[][] = [];

  await withPatchedProperty(
    Product,
    "aggregate",
    ((pipeline: unknown[]) => {
      pipelines.push(pipeline);

      const hasCountStage = pipeline.some((stage) => {
        return (
          typeof stage === "object" &&
          stage !== null &&
          "$count" in stage
        );
      });

      if (hasCountStage) {
        return Promise.resolve([{ total: 1 }]);
      }

      return Promise.resolve([
        {
          _id: new Types.ObjectId(),
          name: "Search result",
          slug: "search-result",
          type: "Sunglasses",
          collectionId: new Types.ObjectId(),
          brand: "Season",
          salePercent: 0,
          availability: "in_stock",
          description: "",
          specifications: {
            frameType: {
              material: "Metal",
              size: {
                label: "Small",
                image: "https://example.com/size.jpg",
              },
            },
            gender: "Unisex",
          },
          variants: [],
          rating: { avg: 0, count: 0 },
          isActive: true,
          score: 12,
        },
      ]);
    }) as unknown as typeof Product.aggregate,
    async () => {
      const response = await searchProducts({
        q: "season",
        type: null,
        gender: null,
        sale: false,
        offset: 0,
        limit: 10,
      });

      assert.equal(response.total, 1);
      assert.equal(pipelines.length, 2);
      for (const pipeline of pipelines) {
        const matchStage = pipeline[1] as { $match?: Record<string, unknown> } | undefined;

        assert.deepEqual(matchStage?.$match, {
          isActive: true,
          availability: "in_stock",
        });
      }
    },
  );
});

test("getCollectionProductsBySlug filters collection products to active in-stock items", async () => {
  let countedFilter: Record<string, unknown> | null = null;
  let foundFilter: Record<string, unknown> | null = null;
  const collectionId = new Types.ObjectId();

  await withPatchedProperty(
    Collection,
    "findOne",
    ((filter: Record<string, unknown>) => {
      assert.deepEqual(filter, { slug: "summer-edit" });

      return {
        select: () => ({
          lean: async () => ({
            _id: collectionId,
          }),
        }),
      };
    }) as unknown as typeof Collection.findOne,
    async () => {
      await withPatchedProperty(
        Product,
        "countDocuments",
        (async (filter: Record<string, unknown>) => {
          countedFilter = filter;
          return 1;
        }) as unknown as typeof Product.countDocuments,
        async () => {
          await withPatchedProperty(
            Product,
            "find",
            ((filter: Record<string, unknown>) => {
              foundFilter = filter;

              return {
                select: () => ({
                  sort: () => ({
                    skip: () => ({
                      limit: () => ({
                        lean: async () => [],
                      }),
                    }),
                  }),
                }),
              };
            }) as unknown as typeof Product.find,
            async () => {
              await getCollectionProductsBySlug("summer-edit", {
                frameType: null,
                frameSize: null,
                sort: "title-asc",
                offset: 0,
                limit: 10,
              });

              assert.deepEqual(countedFilter, {
                isActive: true,
                availability: "in_stock",
                collectionId,
              });
              assert.deepEqual(foundFilter, {
                isActive: true,
                availability: "in_stock",
                collectionId,
              });
            },
          );
        },
      );
    },
  );
});
