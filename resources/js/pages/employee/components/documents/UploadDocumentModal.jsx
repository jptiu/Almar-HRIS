import { useRef, useState } from "react";
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
} from "./hooks";

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

export const UploadDocumentModal = ({ isOpen, onClose }) => {
    const [description, setDescription] = useState("");
    const [documentTypeId, setDocumentTypeId] = useState("");
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const { data: documentTypesData } = useFetchDocumentTypesQuery();
    const uploadMutation = useStoreMyDocumentMutation();

    const resetForm = () => {
        setDescription("");
        setDocumentTypeId("");
        setFile(null);
        setIsDragging(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        if (uploadMutation.isPending) return;
        resetForm();
        onClose();
    };

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        setFile(selectedFile);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!description.trim() || !documentTypeId || !file) {
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
            title="Upload Document"
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
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                fileInputRef.current?.click();
                            }
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsDragging(false);
                            const droppedFile = event.dataTransfer.files?.[0];
                            handleFileSelect(droppedFile);
                        }}
                        className={`w-full border-2 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                            isDragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400 bg-gray-50"
                        }`}
                    >
                        <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                        <p className="text-sm font-medium text-gray-700">
                            Drag and drop a file here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            or click to browse
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
                        disabled={uploadMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            uploadMutation.isPending ||
                            !description.trim() ||
                            !documentTypeId ||
                            !file
                        }
                    >
                        {uploadMutation.isPending ? "Uploading..." : "Upload"}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};
