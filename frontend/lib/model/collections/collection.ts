export interface CollectionArgs {
  id: string;
  name: string;
  slug: string;
  inStockCount: number;
}

export class Collection {
  id: string;
  name: string;
  slug: string;
  inStockCount: number;

  constructor(args: CollectionArgs) {
    this.id = args.id;
    this.name = args.name;
    this.slug = args.slug;
    this.inStockCount = args.inStockCount;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static deser(data: any): Collection {
    return new Collection({
      id: data?.id ?? "",
      name: data?.name ?? "",
      slug: data?.slug ?? "",
      inStockCount: data?.inStockCount ?? 0,
    });
  }
}
