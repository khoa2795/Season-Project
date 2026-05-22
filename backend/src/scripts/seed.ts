import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Collection } from "../models/Collection.js";
import { Eyeglasses } from "../models/Eyeglasses.js";
import { Sunglasses } from "../models/Sunglasses.js";
import { Brand } from "../models/Brand.js";
import { Category } from "../models/Category.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env.backend") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SeedProduct {
  brand: string;
  slug: string;
  [key: string]: unknown;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function addProductRelations(
  products: SeedProduct[],
  brandIds: Map<string, mongoose.Types.ObjectId>,
  categoryId: mongoose.Types.ObjectId,
): SeedProduct[] {
  return products.map((product) => {
    const brandId = brandIds.get(product.brand);

    if (brandId === undefined) {
      throw new Error(`Missing brand relation for ${product.slug}`);
    }

    return {
      ...product,
      brandId,
      categoryId,
    };
  });
}

function assertDestructiveSeedAllowed(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed with dropDatabase in production");
  }

  if (process.env.ALLOW_DESTRUCTIVE_SEED !== "true") {
    throw new Error(
      "Set ALLOW_DESTRUCTIVE_SEED=true to seed and drop the target database",
    );
  }
}

const seedDatabase = async () => {
  try {
    assertDestructiveSeedAllowed();

    const mongoUri = process.env.MONGO_URI;
    if (mongoUri === undefined || mongoUri === "") {
      throw new Error("Please provide a MongoDB URI in .env.backend");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // 1. Read the normalized JSON files
    const collectionsPath = path.join(
      __dirname,
      "../../season_data/collections-normalized.json",
    );
    const sunglassesPath = path.join(
      __dirname,
      "../../season_data/sunglasses-normalized.json",
    );
    const eyeglassesPath = path.join(
      __dirname,
      "../../season_data/eyeglasses-normalized.json",
    );

    const collectionsRaw = fs.readFileSync(collectionsPath, "utf-8");
    const sunglassesRaw = fs.readFileSync(sunglassesPath, "utf-8");
    const eyeglassesRaw = fs.readFileSync(eyeglassesPath, "utf-8");

    const collections = JSON.parse(collectionsRaw);
    const sunglasses = JSON.parse(sunglassesRaw) as SeedProduct[];
    const eyeglasses = JSON.parse(eyeglassesRaw) as SeedProduct[];
    const uniqueSunglasses = Array.from(
      new Map(
        sunglasses.map((product) => [product.slug, product]),
      ).values(),
    );
    const uniqueEyeglasses = Array.from(
      new Map(
        eyeglasses.map((product) => [product.slug, product]),
      ).values(),
    );

    // 2. Clear entire database (drop all schemas and data)
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log(
        "Completely dropped the database (all schemas and data cleared)",
      );
    } else {
      console.log("Could not drop database: connection.db is undefined");
    }

    // 3. Insert the normalized data
    await Collection.insertMany(collections);
    console.log(`Successfully seeded ${collections.length} collections!`);

    const brandNames = Array.from(
      new Set(
        [...uniqueSunglasses, ...uniqueEyeglasses].map(
          (product) => product.brand,
        ),
      ),
    );
    const brands = await Brand.insertMany(
      brandNames.map((brandName) => ({
        name: brandName,
        slug: slugify(brandName),
      })),
    );
    const brandIds = new Map(
      brands.map((brand) => [brand.name, brand._id as mongoose.Types.ObjectId]),
    );
    console.log(`Successfully seeded ${brands.length} brands!`);

    const categories = await Category.insertMany([
      {
        name: "Eyeglasses",
        slug: "eyeglasses",
      },
      {
        name: "Sunglasses",
        slug: "sunglasses",
      },
    ]);
    const eyeglassesCategory = categories.find(
      (category) => category.slug === "eyeglasses",
    );
    const sunglassesCategory = categories.find(
      (category) => category.slug === "sunglasses",
    );

    if (eyeglassesCategory === undefined || sunglassesCategory === undefined) {
      throw new Error("Missing seeded eyewear categories");
    }

    console.log(`Successfully seeded ${categories.length} categories!`);

    const sunglassesWithRelations = addProductRelations(
      uniqueSunglasses,
      brandIds,
      sunglassesCategory._id as mongoose.Types.ObjectId,
    );
    const eyeglassesWithRelations = addProductRelations(
      uniqueEyeglasses,
      brandIds,
      eyeglassesCategory._id as mongoose.Types.ObjectId,
    );

    await Sunglasses.insertMany(sunglassesWithRelations);
    console.log(`Successfully seeded ${uniqueSunglasses.length} sunglasses!`);

    await Eyeglasses.insertMany(eyeglassesWithRelations);
    console.log(`Successfully seeded ${uniqueEyeglasses.length} eyeglasses!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
