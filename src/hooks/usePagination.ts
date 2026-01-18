import type { PaginatorPageChangeEvent } from "primereact/paginator";
import { useState } from "react";

export const usePagination = () => {
    const perPageOptions = [10, 20, 30];
    const [page, setPage] = useState(0);
    const [nextPage, setNextPage] = useState(0);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [first, setFirst] = useState(0);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setSize(event.rows);
        setNextPage(event.page);
        setPage(event.page);
        setFirst(event.first);
    };

    const setPagination = ({ page, size, total, pageCount }: { page: number, size: number, total: number, pageCount: number }) => {
        setPage(page);
        setSize(size);
        setTotal(total);
        setPageCount(pageCount);
    }

    return {
        page,
        size,
        total,
        pageCount,
        perPageOptions,
        nextPage,
        first,
        onPageChange,
        setNextPage,
        setPagination
    }
}