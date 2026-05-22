import { Types } from "mongoose";
import { Cart, type ICart } from "../models/Cart.js";
import { Eyeglasses } from "../models/Eyeglasses.js";
import { Sunglasses } from "../models/Sunglasses.js";
import type {
  IVariant,
  ProductAvailability,
  ProductModelName,
} from "../models/sharedProduct.js";
import type {
  AddCartItemInput,
  CartSkuInput,
  CartItemResponse,
  CartResponseData,
  UpdateCartItemInput,
} from "../types/cart.js";

interface CartProduct {
  _id: Types.ObjectId;
  productModel: ProductModelName;
  availability: ProductAvailability;
  isActive: boolean;
  variants: IVariant[];
}

interface CartSkuProduct extends CartProduct {
  variant: IVariant;
}

export class CartServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CartServiceError";
    this.statusCode = statusCode;
  }
}

function selectDefaultVariant(variants: IVariant[]): IVariant | null {
  const defaultVariant = variants.find((variant) => variant.isDefault === true);

  if (defaultVariant !== undefined) {
    return defaultVariant;
  }

  return variants[0] ?? null;
}

async function findCartProduct(productId: string): Promise<CartProduct | null> {
  const productFields = "availability isActive variants";
  const eyeglasses = await Eyeglasses.findById(productId)
    .select(productFields)
    .lean<{
      _id: Types.ObjectId;
      availability: ProductAvailability;
      isActive: boolean;
      variants: IVariant[];
    } | null>();

  if (eyeglasses !== null) {
    return {
      ...eyeglasses,
      productModel: "Eyeglasses",
    };
  }

  const sunglasses = await Sunglasses.findById(productId)
    .select(productFields)
    .lean<{
      _id: Types.ObjectId;
      availability: ProductAvailability;
      isActive: boolean;
      variants: IVariant[];
    } | null>();

  if (sunglasses === null) {
    return null;
  }

  return {
    ...sunglasses,
    productModel: "Sunglasses",
  };
}

function toSkuProduct(
  product: Omit<CartProduct, "productModel">,
  productModel: ProductModelName,
  sku: string,
): CartSkuProduct | null {
  const variant = product.variants.find((item) => item.sku === sku);

  if (variant === undefined) {
    return null;
  }

  return {
    ...product,
    productModel,
    variant,
  };
}

async function findCartProductBySku(sku: string): Promise<CartSkuProduct | null> {
  const productFields = "availability isActive variants";
  const eyeglasses = await Eyeglasses.findOne({ "variants.sku": sku })
    .select(productFields)
    .lean<{
      _id: Types.ObjectId;
      availability: ProductAvailability;
      isActive: boolean;
      variants: IVariant[];
    } | null>();

  if (eyeglasses !== null) {
    return toSkuProduct(eyeglasses, "Eyeglasses", sku);
  }

  const sunglasses = await Sunglasses.findOne({ "variants.sku": sku })
    .select(productFields)
    .lean<{
      _id: Types.ObjectId;
      availability: ProductAvailability;
      isActive: boolean;
      variants: IVariant[];
    } | null>();

  return sunglasses === null
    ? null
    : toSkuProduct(sunglasses, "Sunglasses", sku);
}

function toCartItemResponse(item: ICart["items"][number]): CartItemResponse {
  return {
    productId: item.productId.toString(),
    productModel: item.productModel,
    variantSku: item.variantSku,
    quantity: item.quantity,
  };
}

function toCartResponse(cart: ICart): CartResponseData {
  return {
    id: cart._id.toString(),
    userId: cart.userId.toString(),
    items: cart.items.map(toCartItemResponse),
  };
}

function assertProductCanBeAddedToCart(product: CartProduct): IVariant {
  if (product.isActive !== true || product.availability !== "in_stock") {
    throw new CartServiceError("Product is not available for sale", 409);
  }

  const variant = selectDefaultVariant(product.variants);

  if (variant === null || variant.sku.trim() === "") {
    throw new CartServiceError("Product does not have a sellable variant", 409);
  }

  return variant;
}

function assertSkuProductCanBeAddedToCart(product: CartSkuProduct): IVariant {
  if (product.isActive !== true || product.availability !== "in_stock") {
    throw new CartServiceError("Product is not available for sale", 409);
  }

  if (product.variant.sku.trim() === "") {
    throw new CartServiceError("Product does not have a sellable variant", 409);
  }

  return product.variant;
}

function assertQuantityWithinStock(quantity: number, stock: number): void {
  if (quantity > stock) {
    throw new CartServiceError(
      `Requested quantity exceeds available stock (${stock})`,
      409,
    );
  }
}

export async function addItemToCart(
  userId: string,
  input: AddCartItemInput,
): Promise<CartResponseData> {
  const product = await findCartProduct(input.productId);

  if (product === null) {
    throw new CartServiceError("Product not found", 404);
  }

  const variant = assertProductCanBeAddedToCart(product);

  const cart =
    (await Cart.findOne({ userId })) ??
    new Cart({
      userId: new Types.ObjectId(userId),
      items: [],
    });
  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === product._id.toString() &&
      item.productModel === product.productModel &&
      item.variantSku === variant.sku,
  );
  const nextQuantity =
    existingItem === undefined
      ? input.quantity
      : existingItem.quantity + input.quantity;

  assertQuantityWithinStock(nextQuantity, variant.stock);

  if (existingItem !== undefined) {
    existingItem.quantity = nextQuantity;
  } else {
    cart.items.push({
      productId: product._id,
      productModel: product.productModel,
      variantSku: variant.sku,
      quantity: input.quantity,
    });
  }

  await cart.save();
  return toCartResponse(cart);
}

export async function getCartForUser(userId: string): Promise<CartResponseData> {
  const existingCart = await Cart.findOne({ userId });

  if (existingCart !== null) {
    return toCartResponse(existingCart);
  }

  const cart = await Cart.create({
    userId: new Types.ObjectId(userId),
    items: [],
  });

  return toCartResponse(cart);
}

export async function addSkuItemToCart(
  userId: string,
  input: CartSkuInput,
): Promise<CartResponseData> {
  const product = await findCartProductBySku(input.sku);

  if (product === null) {
    throw new CartServiceError("Product variant not found", 404);
  }

  const variant = assertSkuProductCanBeAddedToCart(product);
  const cart =
    (await Cart.findOne({ userId })) ??
    new Cart({
      userId: new Types.ObjectId(userId),
      items: [],
    });
  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === product._id.toString() &&
      item.productModel === product.productModel &&
      item.variantSku === variant.sku,
  );
  const nextQuantity =
    existingItem === undefined
      ? input.quantity
      : existingItem.quantity + input.quantity;

  assertQuantityWithinStock(nextQuantity, variant.stock);

  if (existingItem === undefined) {
    cart.items.push({
      productId: product._id,
      productModel: product.productModel,
      variantSku: variant.sku,
      quantity: input.quantity,
    });
  } else {
    existingItem.quantity = nextQuantity;
  }

  await cart.save();
  return toCartResponse(cart);
}

export async function updateCartItemQuantity(
  userId: string,
  input: UpdateCartItemInput,
): Promise<CartResponseData> {
  const cart = await Cart.findOne({ userId });

  if (cart === null) {
    throw new CartServiceError("Cart item not found", 404);
  }

  const product = await findCartProduct(input.productId);

  if (product === null) {
    throw new CartServiceError("Product not found", 404);
  }

  const variant = assertProductCanBeAddedToCart(product);
  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === product._id.toString() &&
      item.productModel === product.productModel &&
      item.variantSku === variant.sku,
  );

  if (existingItem === undefined) {
    throw new CartServiceError("Cart item not found", 404);
  }

  assertQuantityWithinStock(input.quantity, variant.stock);
  existingItem.quantity = input.quantity;

  await cart.save();
  return toCartResponse(cart);
}

export async function updateSkuCartItemQuantity(
  userId: string,
  input: CartSkuInput,
): Promise<CartResponseData> {
  const cart = await Cart.findOne({ userId });

  if (cart === null) {
    throw new CartServiceError("Cart item not found", 404);
  }

  const product = await findCartProductBySku(input.sku);

  if (product === null) {
    throw new CartServiceError("Product variant not found", 404);
  }

  const variant = assertSkuProductCanBeAddedToCart(product);
  const item = cart.items.find(
    (cartItem) =>
      cartItem.productId.toString() === product._id.toString() &&
      cartItem.productModel === product.productModel &&
      cartItem.variantSku === variant.sku,
  );

  if (item === undefined) {
    throw new CartServiceError("Cart item not found", 404);
  }

  assertQuantityWithinStock(input.quantity, variant.stock);
  item.quantity = input.quantity;
  await cart.save();
  return toCartResponse(cart);
}

export async function removeItemFromCart(
  userId: string,
  productId: string,
): Promise<CartResponseData> {
  const cart = await Cart.findOne({ userId });

  if (cart === null) {
    throw new CartServiceError("Cart item not found", 404);
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (existingItemIndex === -1) {
    throw new CartServiceError("Cart item not found", 404);
  }

  cart.items.splice(existingItemIndex, 1);
  await cart.save();
  return toCartResponse(cart);
}

export async function removeSkuItemFromCart(
  userId: string,
  sku: string,
): Promise<CartResponseData> {
  const cart = await Cart.findOne({ userId });

  if (cart === null) {
    throw new CartServiceError("Cart item not found", 404);
  }

  const itemIndex = cart.items.findIndex((item) => item.variantSku === sku);

  if (itemIndex === -1) {
    throw new CartServiceError("Cart item not found", 404);
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  return toCartResponse(cart);
}

export async function clearCartForUser(
  userId: string,
): Promise<CartResponseData> {
  const cart = await Cart.findOne({ userId });

  if (cart === null) {
    return getCartForUser(userId);
  }

  cart.items = [];
  await cart.save();
  return toCartResponse(cart);
}
