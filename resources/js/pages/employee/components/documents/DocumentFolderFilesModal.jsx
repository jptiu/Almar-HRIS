import { Button, Badge } from "@/components/ui";
import Modal, { ModalFooter } from "@/components/ui/Modal";
import { FileText } from "lucide-react";

export const DocumentFolderFilesModal = ({
    folder,
    files,
    isLoading = false,
    onClose,
}) => {
    return (
        <Modal
            isOpen={!!folder}
            onClose={onClose}
            title={folder ? `${folder.documentType} Files` : "Files"}
            size="md"
        >
            {isLoading ? (
                <div className="py-8 text-center">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400 animate-pulse" />
                    </div>
                    <p className="font-medium text-text-dark">Loading files</p>
                    <p className="text-sm text-text-tertiary mt-1">
                        Fetching files for this folder...
                    </p>
                </div>
            ) : files?.length ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="rounded-xl border border-slate-200 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-medium text-text-dark truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-text-tertiary mt-1">
                                        Uploaded: {file.uploadedAt}
                                    </p>
                                </div>
                                <Badge variant="outline">{file.size}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8 text-center">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-text-dark">
                        No uploaded files
                    </p>
                    <p className="text-sm text-text-tertiary mt-1">
                        There are no files in this folder yet.
                    </p>
                </div>
            )}

            <ModalFooter>
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};
