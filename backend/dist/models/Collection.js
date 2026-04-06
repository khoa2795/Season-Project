import mongoose, { Schema, Document } from "mongoose";
const CollectionSchema = new Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
}, { timestamps: true });
export const Collection = mongoose.model("Collection", CollectionSchema);
//# sourceMappingURL=Collection.js.map