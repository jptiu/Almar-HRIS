import { useState } from "react";
import { MyDocumentsTable } from ".";
import { DeleteDocumentModal } from ".";
import { UploadDocumentModal } from ".";
import { DocumentFolders } from ".";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

export const MyDocuments = () => {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const handleCloseDocumentModal = () => {
        setIsUploadModalOpen(false);
        setEditTarget(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark mb-2">
                        My Documents
                    </h1>
                    <p className="text-text-tertiary">
                        Upload and manage your personal documents here.
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setEditTarget(null);
                        setIsUploadModalOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4" /> Upload Documents
                </Button>
            </div>

            <DocumentFolders />

            <MyDocumentsTable
                setDeleteTarget={setDeleteTarget}
                setEditTarget={setEditTarget}
            />

            <UploadDocumentModal
                isOpen={isUploadModalOpen || Boolean(editTarget)}
                onClose={handleCloseDocumentModal}
                editTarget={editTarget}
            />

            <DeleteDocumentModal
                deleteTarget={deleteTarget}
                setDeleteTarget={setDeleteTarget}
            />
        </div>
    );
};
