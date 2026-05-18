export type GetPaginationParams = {
  offset?: number;
  limit?: number;
};

export function serializePaginationQuery(params: GetPaginationParams) {
  return {
    offset: params.offset,
    limit: params.limit,
  };
}
