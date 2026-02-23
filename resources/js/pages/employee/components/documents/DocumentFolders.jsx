import { useMemo, useState } from "react";
import { Badge } from "@/components/ui";
import { DocumentFolderFilesModal } from ".";

const MOCK_FOLDER_FILES = {
    "Government ID": [
        {
            id: 1,
            name: "Passport.pdf",
            uploadedAt: "Jan 10, 2026",
            size: "1.2 MB",
        },
        {
            id: 2,
            name: "Driver-License.jpg",
            uploadedAt: "Jan 18, 2026",
            size: "860 KB",
        },
    ],
    "Police Clearance": [
        {
            id: 3,
            name: "Employment-Certificate.pdf",
            uploadedAt: "Feb 03, 2026",
            size: "620 KB",
        },
    ],
    "SSS": [
        {
            id: 4,
            name: "Employment-Contract.pdf",
            uploadedAt: "Dec 14, 2025",
            size: "2.0 MB",
        },
        {
            id: 5,
            name: "NDA-Signed.pdf",
            uploadedAt: "Dec 14, 2025",
            size: "740 KB",
        },
    ],
    "PhilHealth": [
        {
            id: 6,
            name: "SSS-Details.pdf",
            uploadedAt: "Feb 09, 2026",
            size: "480 KB",
        },
        {
            id: 7,
            name: "Pag-IBIG-Details.pdf",
            uploadedAt: "Feb 09, 2026",
            size: "430 KB",
        },
        {
            id: 8,
            name: "PhilHealth-Details.pdf",
            uploadedAt: "Feb 09, 2026",
            size: "420 KB",
        },
    ],
    "Resume": [],
};

const MOCK_FOLDERS = Object.entries(MOCK_FOLDER_FILES).map(
    ([documentType, files], index) => ({
        id: index + 1,
        documentType,
        count: files.length,
    }),
);

export const DocumentFolders = () => {
    const [activeFolder, setActiveFolder] = useState(null);

    const activeFiles = useMemo(() => {
        if (!activeFolder) return [];
        return MOCK_FOLDER_FILES[activeFolder.documentType] || [];
    }, [activeFolder]);

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
                        {MOCK_FOLDERS.map((folder) => (
                            <button
                                key={folder.id}
                                type="button"
                                onClick={() => setActiveFolder(folder)}
                                className="w-56 shrink-0 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40"
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
                        ))}
                    </div>
                </div>
            </div>

            <DocumentFolderFilesModal
                folder={activeFolder}
                files={activeFiles}
                onClose={() => setActiveFolder(null)}
            />
        </>
    );
};
