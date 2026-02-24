import React, { useState, useEffect } from "react";
import { z } from "zod";
import { InputField, Button } from "@/components/ui";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddressField } from "@/components/common";

const personalInfoSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters"),
});

// Personal Information Form Component
export const PersonalInfoForm = ({ data, onSave, isLoading = false }) => {
    const [formData, setFormData] = useState(data || {});
    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    // Update form when data changes
    useEffect(() => {
        if (data) {
            setFormData({
                ...data,
                birthday: data.birthdayRaw || data.birthday || "",
            });
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

    const handleAddressChange = (field, value) => {
        setFormData((prev) => {
            if (field === "state") {
                return {
                    ...prev,
                    state: value,
                    city: "",
                    address_line_2: "",
                };
            }

            if (field === "city") {
                return {
                    ...prev,
                    city: value,
                    address_line_2: "",
                };
            }

            return {
                ...prev,
                [field]:
                    field === "firstName" || field === "lastName"
                        ? value.replace(/\d/g, "")
                        : value,
            };
        });

        setIsDirty(true);

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
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                        <InputField
                            label="Phone Number"
                            value={formData.phoneNumber || ""}
                            onChange={handleChange("phoneNumber")}
                            placeholder="Enter phone number"
                            size="xs"
                            variant="light"
                            className={cn(
                                getFieldError("phoneNumber") &&
                                    "border-red-500",
                            )}
                        />
                        {getFieldError("phoneNumber") && (
                            <p className="text-red-500 text-xs mt-1">
                                {getFieldError("phoneNumber")}
                            </p>
                        )}
                    </div>
                </div>

                {/* Address */}
                <AddressField
                    formData={formData}
                    onChange={handleAddressChange}
                    getFieldError={getFieldError}
                />
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
