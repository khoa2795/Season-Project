import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collectionsPath = path.join(
  __dirname,
  "../../season_data/collections.json",
);
const productsPath = path.join(
  __dirname,
  "../../season_data/Products_Grouped (1).json",
);

const normalizedCollectionsPath = path.join(
  __dirname,
  "../../season_data/normalized_collections.json",
);
const normalizedProductsPath = path.join(
  __dirname,
  "../../season_data/normalized_products.json",
);

const normalizeData = () => {
  // 1. Read files
  const collectionsData = JSON.parse(fs.readFileSync(collectionsPath, "utf-8"));
  const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  // 2. Generate normalized collections with ObjectIds
  const normalizedCollections = collectionsData.collections.map(
    (name: string) => ({
      _id: new mongoose.Types.ObjectId().toString(),
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }),
  );

  // 3. Process products to assign collectionId
  const normalizedProducts = productsData.map((product: any) => {
    // Find the collection that matches the beginning of the product name
    const matchingCollection = normalizedCollections.find((c: any) =>
      product.name.toLowerCase().startsWith(c.name.toLowerCase()),
    );

    let collectionId = null;
    if (matchingCollection) {
      collectionId = matchingCollection._id;
    } else {
      console.warn(`No collection found for product: ${product.name}`);
    }
    const { categoryId: _, CollectionId: __, images: ___, ...rest } = product;

    return {
      ...rest,
      collectionId,
    };
  });

  // 4. Write normalized files
  fs.writeFileSync(
    normalizedCollectionsPath,
    JSON.stringify(normalizedCollections, null, 2),
  );
  console.log(
    `✅ Normalized collections saved to ${normalizedCollectionsPath}`,
  );

  fs.writeFileSync(
    normalizedProductsPath,
    JSON.stringify(normalizedProducts, null, 2),
  );
  console.log(`✅ Normalized products saved to ${normalizedProductsPath}`);
};

normalizeData();
