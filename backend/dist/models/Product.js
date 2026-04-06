import mongoose, { Schema, Document, Types } from 'mongoose';
const ProductSchema = new Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection', required: true },
    brand: { type: String, required: true },
    saleInfo: {
        isOnSale: { type: Boolean, default: false },
        salePercent: { type: Number, min: 1, max: 30 }
    },
    availability: { type: String, enum: ['in_stock', 'out_of_stock', 'pre_order'], default: 'in_stock' },
    type: { type: String, default: "Sunglasses" },
    description: { type: String, required: true },
    specifications: {
        frameType: {
            material: { type: String, enum: ['Acetate', 'Metal'] },
            size: { type: String, enum: ['Small', 'Medium', 'Big'] }
        },
        gender: { type: String, enum: ['Male', 'Female', 'Unisex'], default: 'Unisex' }
    },
    variants: [{
            sku: { type: String, required: true },
            color: String,
            size: String,
            price: { type: Number, required: true, min: 0 },
            originalPrice: { type: Number, min: 0 },
            images: [{ type: String }],
            isDefault: { type: Boolean, default: false },
            stock: { type: Number, required: true, min: 1, max: 10 }
        }],
    rating: { avg: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
export const Product = mongoose.model('Product', ProductSchema);
//# sourceMappingURL=Product.js.map