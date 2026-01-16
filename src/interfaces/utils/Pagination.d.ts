export interface Pagination<T> {
    page: number;
    size: number;
    total: number;
    pageCount: number;
    content: T[];
}