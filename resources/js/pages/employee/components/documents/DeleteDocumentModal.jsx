import { Button } from "@/components/ui";
import Modal, { ModalFooter } from "@/components/ui/Modal";
import { Trash2 } from "lucide-react";
import { useDeleteMyDocumentMutation } from "./hooks";

export const DeleteDocumentModal = ({ deleteTarget, setDeleteTarget }) => {
    const deleteMutation = useDeleteMyDocumentMutation();

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <Modal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            title="Delete Document"
            size="sm"
        >
            <div className="flex flex-col items-center text-center gap-4 py-2">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-red-500" />
                </div>
                <div>
                    <p className="text-text-dark font-medium text-lg">
                        Are you sure you want to delete this document?
                    </p>
                    <p className="text-text-tertiary text-sm mt-1">
                        <strong>
                            {deleteTarget?.description ||
                                deleteTarget?.file_name}
                        </strong> {" "}
                        will be permanently removed.
                    </p>
                </div>
            </div>
            <ModalFooter>
                <Button
                    variant="outline"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleteMutation.isPending}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
