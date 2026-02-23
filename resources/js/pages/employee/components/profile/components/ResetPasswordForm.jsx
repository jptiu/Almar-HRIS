import React, { useState } from "react";
import { z } from "zod";
import { InputField, Button } from "@/components/ui";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// Zod validation schema
const resetPasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// Reset Password Form Component
export const ResetPasswordForm = ({ onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const togglePassword = (field) => () => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate with Zod
        const result = resetPasswordSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        // Clear errors and submit
        setErrors({});
        try {
            await onSubmit(formData);
            // Reset form on success
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            toast.success("Password reset successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to reset password");
        }
    };

    const getFieldError = (field) => errors[field] || null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
                <InputField
                    label="Current Password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange("currentPassword")}
                    placeholder="Enter current password"
                    size="sm"
                    variant="light"
                    isPassword={true}
                    showPassword={showPassword.current}
                    togglePassword={togglePassword("current")}
                    rightIcon={showPassword.current ? EyeOff : Eye}
                    className={cn(
                        getFieldError("currentPassword") && "border-red-500",
                    )}
                />
                {getFieldError("currentPassword") && (
                    <p className="text-red-500 text-xs mt-1">
                        {getFieldError("currentPassword")}
                    </p>
                )}
            </div>

            {/* New Password */}
            <div>
                <InputField
                    label="New Password"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange("newPassword")}
                    placeholder="Enter new password (min 8 characters)"
                    size="sm"
                    variant="light"
                    isPassword={true}
                    showPassword={showPassword.new}
                    togglePassword={togglePassword("new")}
                    rightIcon={showPassword.new ? EyeOff : Eye}
                    className={cn(
                        getFieldError("newPassword") && "border-red-500",
                    )}
                />
                {getFieldError("newPassword") && (
                    <p className="text-red-500 text-xs mt-1">
                        {getFieldError("newPassword")}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <InputField
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="Confirm new password"
                    size="sm"
                    variant="light"
                    isPassword={true}
                    showPassword={showPassword.confirm}
                    togglePassword={togglePassword("confirm")}
                    rightIcon={showPassword.confirm ? EyeOff : Eye}
                    className={cn(
                        getFieldError("confirmPassword") && "border-red-500",
                    )}
                />
                {getFieldError("confirmPassword") && (
                    <p className="text-red-500 text-xs mt-1">
                        {getFieldError("confirmPassword")}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-35"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Resetting...
                        </>
                    ) : (
                        <>
                            <Lock className="h-4 w-4" />
                            Reset Password
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
