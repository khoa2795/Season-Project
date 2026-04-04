import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Collection } from "../models/Collection.js";
import { Product } from "../models/Product.js";

dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri === undefined || mongoUri === "") {
      throw new Error("Please provide a MongoDB URI in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // 1. Read the normalized JSON files
    const collectionsPath = path.join(
      __dirname,
      "../../season_data/normalized_collections.json",
    );
    const productsPath = path.join(
      __dirname,
      "../../season_data/normalized_products.json",
    );

    const collectionsRaw = fs.readFileSync(collectionsPath, "utf-8");
    const productsRaw = fs.readFileSync(productsPath, "utf-8");

    const collections = JSON.parse(collectionsRaw);
    const products = JSON.parse(productsRaw);

    // 2. Clear entire database (drop all schemas and data)
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log("🗑️  Completely dropped the database (all schemas and data cleared)");
    } else {
      console.log("⚠️  Could not drop database: connection.db is undefined");
    }

    // 3. Insert the normalized data
    await Collection.insertMany(collections);
    console.log(`🌱 Successfully seeded ${collections.length} collections!`);

    await Product.insertMany(products);
    console.log(`🌱 Successfully seeded ${products.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
