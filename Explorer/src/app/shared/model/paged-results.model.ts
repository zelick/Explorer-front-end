export interface PagedResults<T>{
    items: never[];
    results: T[];
    totalCount: number;
}
  