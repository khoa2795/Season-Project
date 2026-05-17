import { api } from "./api";

type DeserializeableClass<T> = {
  deser(data: any): T;
};

export type ListResponse<T> = {
  records: T[];
  total: number;
};

export async function fetchOne<T>(
  url: string,
  Model: DeserializeableClass<T>,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await api.get(url, { params });
  const data = response.data;

  if (data === undefined) {
    throw new Error(`Missing response data from ${url}`);
  }

  return Model.deser(data);
}

export async function fetchList<T>(
  url: string,
  Model: DeserializeableClass<T>,
  params?: Record<string, unknown>,
): Promise<ListResponse<T>> {
  const response = await api.get(url, { params });
  const data = response.data;

  if (data === undefined) {
    throw new Error(`Missing response data from ${url}`);
  }

  return {
    records: (data.records ?? []).map((item: any) => Model.deser(item)),
    total: data.total ?? 0,
  };
}
