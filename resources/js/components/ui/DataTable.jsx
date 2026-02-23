import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";
import { Pagination } from "./Pagination";

function DataTable({
    columns = [],
    data = null,
    onPageChange,
    onPerPageChange,
    isLoading = false,
    isFetching = false,
    loadingRows = 5,
    emptyIcon,
    emptyMessage = "No data available.",
    className,
    tableClassName,
    maxHeight = "500px",
    stickyHeader = true,
    onRowClick,
    rowClassName,
    mobileCardRender,
}) {
    const rows = data?.data ?? [];
    const isEmpty = !isLoading && rows.length === 0;

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "w-full overflow-auto",
                    mobileCardRender ? "hidden sm:block" : "block",
                )}
                style={{ maxHeight }}
            >
                <table
                    className={cn(
                        "w-full caption-bottom text-sm",
                        tableClassName,
                    )}
                >
                    <thead
                        className={cn(
                            "[&_tr]:border-b [&_tr]:border-border/60",
                            stickyHeader && "sticky top-0 z-10 bg-white",
                        )}
                    >
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        "h-12 px-6 text-left align-middle text-sm font-medium text-slate-400 whitespace-nowrap",
                                        col.align === "center" && "text-center",
                                        col.align === "right" && "text-right",
                                        responsiveClass(col.responsive),
                                        col.className,
                                        col.headerClassName,
                                    )}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody
                        className={cn(
                            "[&_tr:last-child]:border-0 relative transition-opacity duration-200",
                            isFetching &&
                                !isLoading &&
                                "opacity-50 pointer-events-none",
                        )}
                    >
                        {isLoading
                            ? Array.from({ length: loadingRows }).map(
                                  (_, i) => (
                                      <tr
                                          key={`skeleton-${i}`}
                                          className="border-b border-border/60"
                                      >
                                          {columns.map((col) => (
                                              <td
                                                  key={col.key}
                                                  className={cn(
                                                      "px-6 py-5",
                                                      responsiveClass(
                                                          col.responsive,
                                                      ),
                                                  )}
                                              >
                                                  <Skeleton className="h-4 w-3/4" />
                                              </td>
                                          ))}
                                      </tr>
                                  ),
                              )
                            : rows.map((row, rowIndex) => (
                                  <tr
                                      key={row.id ?? rowIndex}
                                      onClick={
                                          onRowClick
                                              ? () => onRowClick(row)
                                              : undefined
                                      }
                                      className={cn(
                                          "border-b border-border/60 transition-colors hover:bg-slate-50/60",
                                          onRowClick && "cursor-pointer",
                                          typeof rowClassName === "function"
                                              ? rowClassName(row, rowIndex)
                                              : rowClassName,
                                      )}
                                  >
                                      {columns.map((col) => {
                                          const value = getNestedValue(
                                              row,
                                              col.key,
                                          );
                                          return (
                                              <td
                                                  key={col.key}
                                                  className={cn(
                                                      "px-6 py-5 align-middle text-sm text-slate-700",
                                                      col.align === "center" &&
                                                          "text-center",
                                                      col.align === "right" &&
                                                          "text-right",
                                                      responsiveClass(
                                                          col.responsive,
                                                      ),
                                                      col.className,
                                                  )}
                                              >
                                                  {col.render
                                                      ? col.render(value, row)
                                                      : (value ?? "—")}
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                    </tbody>
                </table>

                {/* Empty state (inside the bordered container) */}
                {isEmpty && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        {emptyIcon && (
                            <div className="mb-3 text-slate-300">
                                {renderIcon(emptyIcon)}
                            </div>
                        )}
                        <p className="text-sm">{emptyMessage}</p>
                    </div>
                )}
            </div>

            {/* ── Mobile ── */}
            {mobileCardRender && (
                <div className="flex flex-col gap-3 sm:hidden">
                    {isLoading
                        ? Array.from({ length: loadingRows }).map((_, i) => (
                              <div
                                  key={`mobile-skeleton-${i}`}
                                  className="rounded-lg border border-border p-4 space-y-3"
                              >
                                  <Skeleton className="h-4 w-2/3" />
                                  <Skeleton className="h-3 w-1/2" />
                                  <Skeleton className="h-3 w-1/3" />
                              </div>
                          ))
                        : rows.map((row, idx) => (
                              <div
                                  key={row.id ?? idx}
                                  onClick={
                                      onRowClick
                                          ? () => onRowClick(row)
                                          : undefined
                                  }
                                  className={cn(
                                      "rounded-lg border border-border p-4 transition-colors hover:bg-muted/50",
                                      onRowClick && "cursor-pointer",
                                  )}
                              >
                                  {mobileCardRender(row)}
                              </div>
                          ))}

                    {isEmpty && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground rounded-lg border border-border">
                            {emptyIcon && (
                                <div className="mb-3 text-muted-foreground/50">
                                    {renderIcon(emptyIcon)}
                                </div>
                            )}
                            <p className="text-sm">{emptyMessage}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {data && (
                <Pagination
                    currentPage={data.current_page}
                    lastPage={data.last_page}
                    from={data.from}
                    to={data.to}
                    total={data.total}
                    perPage={data.per_page}
                    onPageChange={onPageChange}
                    onPerPageChange={onPerPageChange}
                />
            )}
        </div>
    );
}

function renderIcon(icon) {
    if (
        typeof icon === "function" ||
        (typeof icon === "object" && icon?.$$typeof)
    ) {
        const Icon = icon;
        return <Icon className="h-10 w-10" />;
    }
    return icon;
}

function getNestedValue(obj, path) {
    if (!path) return undefined;
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function responsiveClass(bp) {
    if (!bp) return "";
    const map = {
        sm: "hidden sm:table-cell",
        md: "hidden md:table-cell",
        lg: "hidden lg:table-cell",
        xl: "hidden xl:table-cell",
    };
    return map[bp] ?? "";
}

export { DataTable };
