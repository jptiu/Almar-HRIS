import React from "react";
import { LogOut } from "lucide-react";
import Modal, { ModalFooter } from "../ui/Modal";
import { Button } from "../ui/Button";

export default function LogoutConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sign Out" size="sm">
            <div className="flex flex-col items-center text-center gap-4 py-2">
                <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center">
                    <LogOut className="w-7 h-7 text-danger" />
                </div>
                <div>
                    <p className="text-text-dark font-medium text-lg">
                        Are you sure you want to sign out?
                    </p>
                    <p className="text-text-tertiary text-sm mt-1">
                        You will need to sign in again to access your account.
                    </p>
                </div>
            </div>

            <ModalFooter>
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
