import { useState } from "react";
import {
    DataTable,
    Badge,
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
import { ActionsMenu } from "@/components/common";
import { FileText, Trash2, Download, Folder, Pencil } from "lucide-react";
import dayjs from "dayjs";
import {
    useFetchMyDocumentsQuery,
    useFetchDocumentTypesQuery,
    useDownloadMyDocument,
} from "./hooks";

export const MyDocumentsTable = ({ setDeleteTarget, setEditTarget }) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [documentTypeId, setDocumentTypeId] = useState("");

    const { data, isLoading, isPlaceholderData } = useFetchMyDocumentsQuery(
        page,
        perPage,
        {
            search,
            document_type_id: documentTypeId || undefined,
        },
    );
    const { data: documentTypesData } = useFetchDocumentTypesQuery();
    const { download, downloadingId } = useDownloadMyDocument();

    const columns = [
        {
            key: "description",
            label: "Document Name",
            render: (val) => (
                <span className="font-medium text-text-dark">{val || "—"}</span>
            ),
        },
        {
            key: "document_type.name",
            label: "Type",
            render: (val) => <Badge variant="success">{val || "—"}</Badge>,
        },
        {
            key: "file_name",
            label: "File Name",
        },
        {
            key: "created_at",
            label: "Uploaded Date",
            render: (val) => dayjs(val).format("MMM D, YYYY"),
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (_val, row) => (
                <ActionsMenu
                    row={row}
                    actions={[
                        {
                            label: "Download",
                            icon: <Download className="w-4 h-4" />,
                            onClick: (doc) => download(doc),
                            loading: downloadingId === row.id,
                            loadingLabel: "Downloading...",
                        },
                        {
                            label: "Update",
                            icon: <Pencil className="w-4 h-4" />,
                            onClick: setEditTarget,
                        },
                        {
                            label: "Delete",
                            icon: <Trash2 className="w-4 h-4" />,
                            onClick: setDeleteTarget,
                            variant: "danger",
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-brand-primary" />
                    <CardTitle className="text-lg font-semibold">
                        All Documents
                    </CardTitle>
                </div>
                <CardDescription className={"mb-8"}>
                    Your uploaded documents for HR records
                </CardDescription>

                {/* Search bar */}
                <div className="flex items-center gap-3 flex-wrap justify-end">
                    <InputField
                        label="Search"
                        placeholder="Search documents..."
                        size="xs"
                        variant="light"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-70"
                    />

                    {/* Document Type Filter */}
                    <div>
                        <Select
                            value={documentTypeId}
                            onValueChange={(val) => {
                                setDocumentTypeId(val === "all" ? "" : val);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger
                                className="w-50"
                                size="sm"
                                label="Document Type"
                            >
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {documentTypesData?.document_types?.map(
                                    (type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={String(type.id)}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={data?.documents}
                    isLoading={isLoading}
                    isFetching={isPlaceholderData}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    emptyMessage="No documents uploaded yet."
                    emptyIcon={FileText}
                />
            </CardContent>
        </Card>
    );
};
