import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Badge } from "@/components/ui";
import { DocumentFolderFilesModal } from ".";
import { getMyDocumentTypes, getMyDocumentsByType } from "./api";

const normalizeDocumentTypes = (data) => {
    const categories = data?.categories ?? [];

    return categories
        .map((category, index) => {
            const documentTypeId = category?.document_type?.id;
            const documentType = category?.document_type?.name;

            if (!documentType) return null;

            const count = Number(category?.count ?? 0);

            return {
                id: documentTypeId ?? `${documentType}-${index}`,
                documentTypeId,
                documentType,
                count: Number.isFinite(count) ? count : 0,
            };
        })
        .filter(Boolean);
};

const normalizeDocumentFiles = (data) => {
    const documents = data?.documents ?? [];

    return documents.map((document, index) => ({
        id:
            document?.id ??
            `${document?.file_name || document?.description || "file"}-${index}`,
        name: document?.file_name || document?.description || "Untitled",
        uploadedAt: document?.created_at
            ? dayjs(document.created_at).format("MMM D, YYYY")
            : "—",
        size: document?.formatted_size || "—",
    }));
};

export const DocumentFolders = () => {
    const [activeFolder, setActiveFolder] = useState(null);

    const { data: documentTypesData, isLoading: isLoadingDocumentTypes } =
        useQuery({
            queryKey: ["myDocumentTypes"],
            queryFn: ({ signal }) => getMyDocumentTypes(signal),
            staleTime: 1000 * 60 * 10,
        });

    const folders = useMemo(
        () => normalizeDocumentTypes(documentTypesData),
        [documentTypesData],
    );

    const activeDocumentTypeId = activeFolder?.documentTypeId;

    const { data: filesData, isLoading: isLoadingFiles } = useQuery({
        queryKey: ["myDocumentTypeFiles", activeDocumentTypeId],
        queryFn: ({ signal }) =>
            getMyDocumentsByType(activeDocumentTypeId, signal),
        enabled: !!activeDocumentTypeId,
        staleTime: 1000 * 60 * 5,
    });

    const activeFiles = useMemo(() => {
        if (!activeFolder) return [];
        return normalizeDocumentFiles(filesData);
    }, [activeFolder, filesData]);

    return (
        <>
            <div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-text-dark">
                        Folders
                    </h2>
                </div>

                <div className="overflow-x-auto pb-2">
                    <div className="flex items-stretch gap-3 min-w-max">
                        {isLoadingDocumentTypes ? (
                            <div className="w-56 shrink-0 rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-sm text-text-tertiary">
                                    Loading folders...
                                </p>
                            </div>
                        ) : folders.length === 0 ? (
                            <div className="w-full rounded-xl border border-slate-200 bg-white p-8">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 flex items-center justify-center mb-4 opacity-40">
                                        <img
                                            src="/images/folder.svg"
                                            alt="Empty folder"
                                            className="w-20 h-20"
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-text-dark mb-1">
                                        No folders available
                                    </p>
                                    <p className="text-xs text-text-tertiary">
                                        Upload documents to create folders
                                    </p>
                                </div>
                            </div>
                        ) : (
                            folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    type="button"
                                    onClick={() => setActiveFolder(folder)}
                                    className="w-56 shrink-0 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:shadow-sm cursor-pointer"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="w-20 h-20 flex items-center justify-center">
                                            <img
                                                src="/images/folder.svg"
                                                alt="Folder"
                                                className="w-20 h-20"
                                            />
                                        </div>
                                        <Badge variant="secondary">
                                            {folder.count} file
                                            {folder.count === 1 ? "" : "s"}
                                        </Badge>
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-text-dark">
                                        {folder.documentType}
                                    </p>
                                    <p className="mt-1 text-xs text-text-tertiary">
                                        Click to view files
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <DocumentFolderFilesModal
                folder={activeFolder}
                files={activeFiles}
                isLoading={isLoadingFiles}
                onClose={() => setActiveFolder(null)}
            />
        </>
    );
};
