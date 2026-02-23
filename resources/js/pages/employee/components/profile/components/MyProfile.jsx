import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
} from "@/components/ui";
import {
    ProfileAvatar,
    PersonalInfoForm,
    JobInfoCard,
    LeaveCreditCard,
    ResetPasswordForm,
    ProfileSkeleton,
} from "@/pages/employee/components/profile/components";
import { useFetchProfileQuery } from "../hooks";
import { useUpdateProfileMutation } from "../hooks";
import { useResetPasswordMutation } from "../hooks";
import {
    User,
    Briefcase,
    CalendarDays,
    Lock,
    Mail,
    Building2,
} from "lucide-react";

export const MyProfile = () => {
    // Fetch profile data
    const {
        data: profile,
        isLoading: isProfileLoading,
        error: profileError,
    } = useFetchProfileQuery();

    // Mutations
    const { mutateAsync: updateProfile, isPending: isUpdating } =
        useUpdateProfileMutation();

    const { mutateAsync: resetPassword, isPending: isResetting } =
        useResetPasswordMutation();

    // Handle personal info save
    const handleSavePersonalInfo = (formData) => {
        return updateProfile(formData);
    };

    // Handle password reset
    const handleResetPassword = (formData) => {
        return resetPassword(formData);
    };

    // Loading state
    if (isProfileLoading) {
        return <ProfileSkeleton />;
    }

    // Error state
    if (profileError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-6">
                <div className="text-red-500 text-lg font-medium mb-2">
                    Failed to load profile
                </div>
                <p className="text-gray-500 text-sm mb-4">
                    {profileError.message || "Please try again later"}
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const { personalInfo, jobInfo, leaveCredits } = profile || {};

    return (
        <div className="space-y-6 animate-fade-in mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        My Profile
                    </h1>
                    <p className="text-sm text-gray-500">
                        View and manage your personal information
                    </p>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    {/* Avatar */}
                    <ProfileAvatar
                        firstName={personalInfo?.firstName}
                        lastName={personalInfo?.lastName}
                        size="lg"
                    />

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            {personalInfo?.firstName} {personalInfo?.lastName}
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {personalInfo?.email}
                            </span>
                            <span className="hidden sm:inline text-gray-300">
                                |
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5" />
                                {jobInfo?.department}
                            </span>
                            <span className="hidden sm:inline text-gray-300">
                                |
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5" />
                                {jobInfo?.position}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Personal & Job Info */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Personal Information */}
                    <Card className="rounded-2xl shadow-sm border-gray-100">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-brand-primary" />
                                <CardTitle className="text-lg font-semibold">
                                    Personal Information
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Update your personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PersonalInfoForm
                                data={personalInfo}
                                onSave={handleSavePersonalInfo}
                                isLoading={isUpdating}
                            />
                        </CardContent>
                    </Card>

                    {/* Job Information */}
                    <Card className="rounded-2xl shadow-sm border-gray-100">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-brand-primary" />
                                <CardTitle className="text-lg font-semibold">
                                    Job Information
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Your employment details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <JobInfoCard data={jobInfo} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Leave Credits & Reset Password */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Leave Credits */}
                    <Card className="rounded-2xl shadow-sm border-gray-100">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-brand-primary" />
                                <CardTitle className="text-lg font-semibold">
                                    Leave Credits
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Your available leave balance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4">
                                {leaveCredits?.map((credit, index) => (
                                    <LeaveCreditCard
                                        key={index}
                                        data={credit}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reset Password */}
                    <Card className="rounded-2xl shadow-sm border-gray-100">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-brand-primary" />
                                <CardTitle className="text-lg font-semibold">
                                    Reset Password
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Change your account password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResetPasswordForm
                                onSubmit={handleResetPassword}
                                isLoading={isResetting}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
