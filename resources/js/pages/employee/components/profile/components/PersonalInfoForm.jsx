import React, { useState, useEffect } from "react";
import { z } from "zod";
import { InputField, Button } from "@/components/ui";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

// Zod validation schema
const nameNoNumbersRegex = /^[^\d]+$/;

const personalInfoSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .regex(nameNoNumbersRegex, "First name must not contain numbers"),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .regex(nameNoNumbersRegex, "Last name must not contain numbers"),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters"),
    address: z.string().min(5, "Address is required"),
    birthday: z.string().min(1, "Birthday is required"),
});

// Personal Information Form Component
export const PersonalInfoForm = ({ data, onSave, isLoading = false }) => {
    const [formData, setFormData] = useState(data || {});
    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    // Update form when data changes
    useEffect(() => {
        if (data) {
            setFormData(data);
            setIsDirty(false);
            setErrors({});
        }
    }, [data]);

    const handleChange = (field) => (e) => {
        const rawValue = e.target.value;
        const value =
            field === "firstName" || field === "lastName"
                ? rawValue.replace(/\d/g, "")
                : rawValue;

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setIsDirty(true);
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate with Zod
        const result = personalInfoSchema.safeParse(formData);

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
        await onSave(formData);
        setIsDirty(false);
    };

    const getFieldError = (field) => errors[field] || null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                    <InputField
                        label="First Name"
                        value={formData.firstName || ""}
                        onChange={handleChange("firstName")}
                        placeholder="Enter first name"
                        size="sm"
                        variant="light"
                        className={cn(
                            getFieldError("firstName") && "border-red-500",
                        )}
                    />
                    {getFieldError("firstName") && (
                        <p className="text-red-500 text-xs mt-1">
                            {getFieldError("firstName")}
                        </p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <InputField
                        label="Last Name"
                        value={formData.lastName || ""}
                        onChange={handleChange("lastName")}
                        placeholder="Enter last name"
                        size="sm"
                        variant="light"
                        className={cn(
                            getFieldError("lastName") && "border-red-500",
                        )}
                    />
                    {getFieldError("lastName") && (
                        <p className="text-red-500 text-xs mt-1">
                            {getFieldError("lastName")}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <InputField
                        label="Phone Number"
                        value={formData.phoneNumber || ""}
                        onChange={handleChange("phoneNumber")}
                        placeholder="Enter phone number"
                        size="sm"
                        variant="light"
                        className={cn(
                            getFieldError("phoneNumber") && "border-red-500",
                        )}
                    />
                    {getFieldError("phoneNumber") && (
                        <p className="text-red-500 text-xs mt-1">
                            {getFieldError("phoneNumber")}
                        </p>
                    )}
                </div>

                {/* Birthday */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Birthday
                    </label>
                    <input
                        type="date"
                        value={formData.birthday || ""}
                        onChange={handleChange("birthday")}
                        className={cn(
                            "w-full px-4 py-2 rounded-xl border text-sm",
                            "bg-white border-gray-300",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500",
                            getFieldError("birthday") && "border-red-500",
                        )}
                    />
                    {getFieldError("birthday") && (
                        <p className="text-red-500 text-xs mt-1">
                            {getFieldError("birthday")}
                        </p>
                    )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <InputField
                        label="Address"
                        value={formData.address || ""}
                        onChange={handleChange("address")}
                        placeholder="Enter full address"
                        size="sm"
                        variant="light"
                        className={cn(
                            getFieldError("address") && "border-red-500",
                        )}
                    />
                    {getFieldError("address") && (
                        <p className="text-red-500 text-xs mt-1">
                            {getFieldError("address")}
                        </p>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="min-w-30"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
