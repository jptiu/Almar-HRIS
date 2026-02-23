import React from "react";
import { cn } from "@/lib/utils";

// Skeleton row component
const SkeletonRow = ({ className }) => (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

// Profile Header Skeleton
export const ProfileHeaderSkeleton = () => (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
        {/* Avatar Skeleton */}
        <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />

        {/* Info Skeleton */}
        <div className="flex-1 text-center sm:text-left space-y-2 w-full">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mx-auto sm:mx-0" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto sm:mx-0" />
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </div>
        </div>
    </div>
);

// Personal Info Skeleton
export const PersonalInfoSkeleton = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonRow className="h-14" />
            <SkeletonRow className="h-14" />
            <SkeletonRow className="h-14 md:col-span-2" />
            <SkeletonRow className="h-14" />
            <SkeletonRow className="h-14" />
            <SkeletonRow className="h-14 md:col-span-2" />
        </div>
        <div className="flex justify-end pt-4">
            <SkeletonRow className="h-10 w-32" />
        </div>
    </div>
);

// Job Info Skeleton
export const JobInfoSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
            <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50"
            >
                <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                </div>
            </div>
        ))}
    </div>
);

// Leave Credits Skeleton
export const LeaveCreditsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-3"
            >
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                </div>
                <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
                <div className="flex justify-between">
                    <div className="h-2 bg-gray-200 rounded animate-pulse w-12" />
                    <div className="h-2 bg-gray-200 rounded animate-pulse w-16" />
                </div>
            </div>
        ))}
    </div>
);

// Reset Password Skeleton
export const ResetPasswordSkeleton = () => (
    <div className="space-y-4">
        <SkeletonRow className="h-14" />
        <SkeletonRow className="h-14" />
        <SkeletonRow className="h-14" />
        <div className="flex justify-end pt-4">
            <SkeletonRow className="h-10 w-36" />
        </div>
    </div>
);

// Main Profile Skeleton
export const ProfileSkeleton = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header Skeleton */}
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

            {/* Profile Header Skeleton */}
            <ProfileHeaderSkeleton />

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info Card */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-40 mb-4" />
                        <PersonalInfoSkeleton />
                    </div>

                    {/* Job Info Card */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-4" />
                        <JobInfoSkeleton />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Leave Credits Card */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-28 mb-4" />
                        <LeaveCreditsSkeleton />
                    </div>

                    {/* Reset Password Card */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-4" />
                        <ResetPasswordSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
};
