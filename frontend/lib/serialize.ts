export type GetEyeglassesParams = {
  frameType?: "acetate" | "metal";
  offset?: number;
  limit?: number;
};

// Serializes frontend filter state into query params expected by the backend.
export function serializeEyeglassesQuery(params: GetEyeglassesParams) {
  return {
    frameType: params.frameType,
    offset: params.offset,
    limit: params.limit,
  };
}
