import { useState } from "react";
import { EmployeeDocumentsTable } from "./EmployeeDocumentsTable";
import { EmployeeDocumentDrawer } from "./EmployeeDocumentDrawer";

export const Documents = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isDocumentDrawerOpen, setIsDocumentDrawerOpen] = useState(false);

    const handleCloseDocumentDrawer = () => {
        setIsDocumentDrawerOpen(false);
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
                setIsDocumentDrawerOpen={setIsDocumentDrawerOpen}
            />

            <EmployeeDocumentDrawer
                isOpen={isDocumentDrawerOpen}
                onClose={handleCloseDocumentDrawer}
                employee={selectedEmployee}
            />
        </div>
    );
};
