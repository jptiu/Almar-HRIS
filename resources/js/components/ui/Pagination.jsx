import * as React from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./Select";

const PER_PAGE_OPTIONS = [5, 10, 50, 100];

function Pagination({
    currentPage,
    lastPage,
    from,
    to,
    total,
    perPage,
    onPageChange,
    onPerPageChange,
    className,
}) {
    const pages = buildPageNumbers(currentPage, lastPage);

    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row items-center justify-between gap-3 pt-4",
                className,
            )}
        >
            {/* Per-page selector */}
            <div className="flex items-center gap-2 order-2 sm:order-1">
                <label className="text-sm text-muted-foreground">
                    Rows per page
                </label>

                <Select
                    value={String(perPage)}
                    onValueChange={(val) => {
                        onPerPageChange?.(Number(val));
                        onPageChange?.(1);
                    }}
                >
                    <SelectTrigger
                        size="sm"
                        className="w-20 rounded-lg"
                        aria-label="Rows per page"
                    >
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {PER_PAGE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={String(opt)}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <span className="text-sm text-muted-foreground">
                    {from ?? 0}–{to ?? 0} of {total ?? 0}
                </span>
            </div>

            {/* Controls — only show when there are multiple pages */}
            {lastPage > 1 && (
                <div className="flex items-center gap-1 order-1 sm:order-2">
                    {/* First page */}
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage <= 1}
                        aria-label="First page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous */}
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                        {pages.map((page, idx) =>
                            page === "..." ? (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="px-1 text-muted-foreground text-sm select-none"
                                >
                                    …
                                </span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={
                                        page === currentPage
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon-sm"
                                    onClick={() => onPageChange(page)}
                                    aria-label={`Page ${page}`}
                                    aria-current={
                                        page === currentPage
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {page}
                                </Button>
                            ),
                        )}
                    </div>

                    {/* Next */}
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= lastPage}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last page */}
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onPageChange(lastPage)}
                        disabled={currentPage >= lastPage}
                        aria-label="Last page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

function buildPageNumbers(current, last, delta = 1) {
    const range = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(last - 1, current + delta);

    // Always include first page
    range.push(1);

    if (left > 2) range.push("...");

    for (let i = left; i <= right; i++) {
        range.push(i);
    }

    if (right < last - 1) range.push("...");

    // Always include last page (if more than 1 page)
    if (last > 1) range.push(last);

    return range;
}

export { Pagination };
