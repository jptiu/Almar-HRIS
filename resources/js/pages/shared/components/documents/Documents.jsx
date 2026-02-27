import { useState } from "react";
import { EmployeeDocumentsTable } from "./EmployeeDocumentsTable";
import { EmployeeDocumentModal } from "./EmployeeDocumentModal";

export const Documents = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

    const handleCloseDocumentModal = () => {
        setIsDocumentModalOpen(false);
        setSelectedEmployee(null);
    };

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

            <EmployeeDocumentsTable
                setSelectedEmployee={setSelectedEmployee}
                setIsDocumentModalOpen={setIsDocumentModalOpen}
            />

            <EmployeeDocumentModal
                isOpen={isDocumentModalOpen}
                onClose={handleCloseDocumentModal}
                employee={selectedEmployee}
            />
        </div>
    );
};
