// resources/js/pages/employee/Profile.jsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../ui/Card";
import { Button } from "../../ui/Button";
import Input from "../../ui/Input";
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        position: user?.position || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle profile update
        console.log("Update profile:", formData);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                    My Profile
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Manage your personal information and account settings
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center mb-4">
                            <span className="text-text-primary font-bold text-3xl">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold text-text-primary">
                            {user?.name}
                        </h2>
                        <p className="text-[var(--color-text-tertiary)] text-sm mt-1">
                            {user?.position || "Employee"}
                        </p>
                        <p className="text-[var(--color-text-muted)] text-xs mt-1 capitalize">
                            {user?.role}
                        </p>
                        <div className="mt-6 w-full space-y-2">
                            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
                                <Mail className="w-4 h-4" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>Joined Jan 2024</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Profile Details */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-text-primary">
                            Personal Information
                        </h2>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                leftIcon={<User className="w-4 h-4" />}
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                leftIcon={<Mail className="w-4 h-4" />}
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <Input
                                label="Phone Number"
                                leftIcon={<Phone className="w-4 h-4" />}
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                            />
                            <Input
                                label="Address"
                                leftIcon={<MapPin className="w-4 h-4" />}
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                            />
                            <Input
                                label="Position"
                                leftIcon={<Briefcase className="w-4 h-4" />}
                                value={formData.position}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        position: e.target.value,
                                    })
                                }
                            />

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" variant="primary">
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[var(--color-text-tertiary)] text-sm">
                                    Full Name
                                </label>
                                <p className="text-text-primary mt-1">
                                    {formData.name}
                                </p>
                            </div>
                            <div>
                                <label className="text-[var(--color-text-tertiary)] text-sm">
                                    Email Address
                                </label>
                                <p className="text-text-primary mt-1">
                                    {formData.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-[var(--color-text-tertiary)] text-sm">
                                    Phone Number
                                </label>
                                <p className="text-text-primary mt-1">
                                    {formData.phone || "Not provided"}
                                </p>
                            </div>
                            <div>
                                <label className="text-[var(--color-text-tertiary)] text-sm">
                                    Address
                                </label>
                                <p className="text-text-primary mt-1">
                                    {formData.address || "Not provided"}
                                </p>
                            </div>
                            <div>
                                <label className="text-[var(--color-text-tertiary)] text-sm">
                                    Position
                                </label>
                                <p className="text-text-primary mt-1">
                                    {formData.position}
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Profile;
