import { useEffect, useRef, useState } from "react";
import { Button, InputField } from "@/components/ui";
import Modal, { ModalFooter } from "@/components/ui/Modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { UploadCloud } from "lucide-react";
import {
    useFetchDocumentTypesQuery,
    useStoreMyDocumentMutation,
    useUpdateMyDocumentMutation,
} from "./hooks";

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

export const UploadDocumentModal = ({ isOpen, onClose, editTarget = null }) => {
    const [description, setDescription] = useState("");
    const [documentTypeId, setDocumentTypeId] = useState("");
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const { data: documentTypesData } = useFetchDocumentTypesQuery();
    const uploadMutation = useStoreMyDocumentMutation();
    const updateMutation = useUpdateMyDocumentMutation();
    const isEditMode = Boolean(editTarget?.id);
    const isSubmitting = isEditMode
        ? updateMutation.isPending
        : uploadMutation.isPending;

    const resetForm = () => {
        setDescription("");
        setDocumentTypeId("");
        setFile(null);
        setIsDragging(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        if (isEditMode) {
            setDescription(editTarget?.description || "");
            setDocumentTypeId(
                String(
                    editTarget?.document_type_id ||
                        editTarget?.document_type?.id ||
                        "",
                ),
            );
            setFile(
                editTarget?.file_name ? { name: editTarget.file_name } : null,
            );
            return;
        }

        resetForm();
    }, [editTarget, isEditMode, isOpen]);

    const handleClose = () => {
        if (isSubmitting) return;
        resetForm();
        onClose();
    };

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        setFile(selectedFile);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!description.trim() || !documentTypeId || (!isEditMode && !file)) {
            return;
        }

        if (isEditMode) {
            updateMutation.mutate(
                {
                    document: editTarget.id,
                    description: description.trim(),
                    document_type_id: documentTypeId,
                },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );

            return;
        }

        uploadMutation.mutate(
            {
                description: description.trim(),
                document_type_id: documentTypeId,
                file,
            },
            {
                onSuccess: () => {
                    handleClose();
                },
            },
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? "Update Document" : "Upload Document"}
            size="md"
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <InputField
                    label="Document Name"
                    placeholder="Enter document name"
                    size="sm"
                    variant="light"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />

                <Select
                    value={documentTypeId}
                    onValueChange={(value) => setDocumentTypeId(value)}
                >
                    <SelectTrigger
                        size="sm"
                        label="Document Type"
                        className="w-full"
                    >
                        <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                        {documentTypesData?.document_types?.map((type) => (
                            <SelectItem key={type.id} value={String(type.id)}>
                                {type.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div>
                    <p className="text-[12px] mb-1 text-gray-500">File</p>
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                            if (!isEditMode) {
                                fileInputRef.current?.click();
                            }
                        }}
                        onKeyDown={(event) => {
                            if (isEditMode) return;
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                fileInputRef.current?.click();
                            }
                        }}
                        onDragOver={(event) => {
                            if (isEditMode) return;
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => {
                            if (isEditMode) return;
                            setIsDragging(false);
                        }}
                        onDrop={(event) => {
                            if (isEditMode) return;
                            event.preventDefault();
                            setIsDragging(false);
                            const droppedFile = event.dataTransfer.files?.[0];
                            handleFileSelect(droppedFile);
                        }}
                        className={`w-full border-2 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                            isDragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400 bg-gray-50"
                        } ${isEditMode ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                        <p className="text-sm font-medium text-gray-700">
                            {isEditMode
                                ? "Current file is locked"
                                : "Drag and drop a file here"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {isEditMode
                                ? "File cannot be changed when updating"
                                : "or click to browse"}
                        </p>
                        {file && (
                            <p className="text-xs text-gray-700 mt-3">
                                Selected:{" "}
                                <span className="font-medium">{file.name}</span>
                            </p>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_EXTENSIONS}
                        className="hidden"
                        disabled={isEditMode}
                        onChange={(event) =>
                            handleFileSelect(event.target.files?.[0])
                        }
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Allowed: PDF, JPG, PNG, DOC, DOCX (max 10MB)
                    </p>
                </div>

                <ModalFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            !description.trim() ||
                            !documentTypeId ||
                            (!isEditMode && !file)
                        }
                    >
                        {isSubmitting
                            ? isEditMode
                                ? "Updating..."
                                : "Uploading..."
                            : isEditMode
                              ? "Update"
                              : "Upload"}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};
