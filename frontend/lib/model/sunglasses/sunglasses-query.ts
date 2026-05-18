export type SunglassesQuery = {
  collectionId?: string;
};

export function serializeSunglassesQuery(params: SunglassesQuery) {
  return {
    collectionId: params.collectionId,
  };
}
