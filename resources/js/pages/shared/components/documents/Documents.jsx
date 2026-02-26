import { useState } from "react";
import {
    DataTable,
    Badge,
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    InputField,
    CardDescription,
} from "@/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { FileText, Folder, Eye } from "lucide-react";
import { getInitials, getColorFromName } from "@/helpers";
import {
    useFetchEmployeeDocumentsQuery,
    useFetchBranchesQuery,
    useFetchCompaniesQuery,
} from "./hooks";

export const Documents = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [branchId, setBranchId] = useState("");

    const { data, isLoading, isPlaceholderData } =
        useFetchEmployeeDocumentsQuery(page, perPage, {
            search,
            company_id: companyId || undefined,
            branch_id: branchId || undefined,
        });

    const { data: branchesData } = useFetchBranchesQuery();
    const { data: companiesData } = useFetchCompaniesQuery();

    // Filter branches based on selected company
    const filteredBranches = companyId
        ? branchesData?.branches?.filter(
              (b) => String(b.company_id) === companyId,
          )
        : branchesData?.branches;

    const columns = [
        {
            key: "first_name",
            label: "Employee",
            render: (_val, row) => {
                const fullName =
                    `${row.first_name} ${row.middle_name ? row.middle_name + " " : ""}${row.last_name}`.trim();
                const initials = getInitials(row.first_name, row.last_name);
                const bgColor = getColorFromName(fullName);

                return (
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                            style={{ backgroundColor: bgColor }}
                        >
                            {initials}
                        </div>
                        <span className="font-medium text-text-dark">
                            {fullName}
                        </span>
                    </div>
                );
            },
        },
        {
            key: "position",
            label: "Position",
            render: (val) => (
                <span className="text-text-dark">{val || "—"}</span>
            ),
        },
        {
            key: "department",
            label: "Department",
            render: (val) => (
                <span className="text-text-dark">{val || "—"}</span>
            ),
        },
        {
            key: "documents_count",
            label: "Documents",
            render: (val) => (
                <Badge variant="default">
                    {val} {val === 1 ? "file" : "files"}
                </Badge>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (_val, row) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="text-text-tertiary hover:text-text-dark"
                    onClick={() => {}}
                >
                    <Eye className="w-4 h-4" />
                    <span>View Documents</span>
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark mb-2">
                        Employee Documents
                    </h1>
                    <p className="text-text-tertiary">
                        Select an employee to view their documents
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Folder className="h-5 w-5 text-brand-primary" />
                        <CardTitle className="text-lg font-semibold">
                            All Employees
                        </CardTitle>
                    </div>
                    <CardDescription className={"mb-8"}>
                        {data?.employees?.total} employee(s) found
                    </CardDescription>

                    {/* Search & Filters */}
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                        <InputField
                            label="Search"
                            placeholder="Search employees..."
                            size="xs"
                            variant="light"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-70"
                        />

                        {/* Company Filter */}
                        <div>
                            <Select
                                value={companyId}
                                onValueChange={(val) => {
                                    setCompanyId(val === "all" ? "" : val);
                                    setBranchId("");
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger
                                    className="w-50"
                                    size="sm"
                                    label="Company"
                                >
                                    <SelectValue placeholder="All Companies" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Companies
                                    </SelectItem>
                                    {companiesData?.companies?.map(
                                        (company) => (
                                            <SelectItem
                                                key={company.id}
                                                value={String(company.id)}
                                            >
                                                {company.name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Branch Filter */}
                        <div>
                            <Select
                                value={branchId}
                                onValueChange={(val) => {
                                    setBranchId(val === "all" ? "" : val);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger
                                    className="w-50"
                                    size="sm"
                                    label="Branch"
                                >
                                    <SelectValue placeholder="All Branches" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Branches
                                    </SelectItem>
                                    {filteredBranches?.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={String(branch.id)}
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data?.employees}
                        isLoading={isLoading}
                        isFetching={isPlaceholderData}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                        emptyMessage="No employees with documents found."
                        emptyIcon={FileText}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
