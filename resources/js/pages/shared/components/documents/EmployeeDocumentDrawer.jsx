import { useMemo } from "react";
import { Button } from "@/components/ui";
import Drawer, { DrawerFooter } from "@/components/ui/Drawer";
import { FileText } from "lucide-react";
import { useFetchEmployeeDocumentTypesQuery } from "./hooks";

const normalizeDocumentCategories = (data) => {
    const categories = data?.categories ?? [];

    return categories
        .map((category, index) => {
            const documentTypeName = category?.document_type?.name;

            if (!documentTypeName) return null;

            const count = Number(category?.count ?? 0);

            return {
                id:
                    category?.document_type?.id ??
                    `${documentTypeName}-${index}`,
                name: documentTypeName,
                count: Number.isFinite(count) ? count : 0,
            };
        })
        .filter(Boolean);
};

const getEmployeeName = (employee) => {
    if (!employee) return "Employee";

    const fullName =
        `${employee.first_name || ""} ${employee.middle_name ? `${employee.middle_name} ` : ""}${employee.last_name || ""}`.trim();

    return fullName || "Employee";
};

export const EmployeeDocumentDrawer = ({ isOpen, onClose, employee }) => {
    const employeeId = employee?.employeeId;

    const { data, isLoading, isFetching } =
        useFetchEmployeeDocumentTypesQuery(employeeId);

    const categories = useMemo(() => normalizeDocumentCategories(data), [data]);

    const employeeName = getEmployeeName(employee);

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={`${employeeName} Documents`}
            size="xl"
        >
            {isLoading || isFetching ? (
                <div className="py-12 text-center">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400 animate-pulse" />
                    </div>
                    <p className="font-medium text-text-dark">
                        Loading document types
                    </p>
                    <p className="text-sm text-text-tertiary mt-1">
                        Fetching folders for this employee...
                    </p>
                </div>
            ) : categories.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className="flex flex-col items-center text-center p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <div className="w-16 h-16 flex items-center justify-center">
                                <img
                                    src="/images/folder.svg"
                                    alt="Document folder"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="mt-2 text-sm font-medium text-text-dark leading-tight">
                                {category.name}
                            </p>
                            <p className="text-xs text-text-tertiary">
                                {category.count} File(s)
                            </p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-text-dark">
                        No document folders found
                    </p>
                    <p className="text-sm text-text-tertiary mt-1">
                        This employee has no uploaded document categories yet.
                    </p>
                </div>
            )}
        </Drawer>
    );
};
