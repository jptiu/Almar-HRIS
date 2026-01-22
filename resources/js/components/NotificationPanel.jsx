// resources/js/components/NotificationPanel.jsx
import { X, Check, Trash2, Bell } from "lucide-react";
import useNotificationStore from "../stores/notificationStore";
import useUIStore from "../stores/uiStore";
import Badge from "../ui/Badge";

const NotificationPanel = () => {
    const notifications = useNotificationStore((state) => state.notifications);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
    const removeNotification = useNotificationStore(
        (state) => state.removeNotification
    );
    const clearAll = useNotificationStore((state) => state.clearAll);
    const toggleNotificationPanel = useUIStore(
        (state) => state.toggleNotificationPanel
    );

    const getNotificationIcon = (type) => {
        switch (type) {
            case "success":
                return (
                    <Check className="w-5 h-5 text-[var(--color-success)]" />
                );
            case "warning":
                return <Bell className="w-5 h-5 text-[var(--color-warning)]" />;
            case "error":
                return <Bell className="w-5 h-5 text-[var(--color-danger)]" />;
            default:
                return <Bell className="w-5 h-5 text-[var(--color-info)]" />;
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="fixed right-4 top-20 w-96 max-h-[600px] glass-container rounded-lg shadow-[0_12px_40px_var(--color-shadow-elevation)] z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-default)]">
                <h3 className="text-lg font-semibold text-text-primary">
                    Notifications
                </h3>
                <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[var(--color-text-tertiary)] hover:text-text-primary transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={toggleNotificationPanel}
                        className="p-1 hover:bg-(--color-brand-primary-100) rounded transition-colors"
                    >
                        <X className="w-4 h-4 text-text-primary" />
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Bell className="w-12 h-12 text-[var(--color-text-muted)] mb-3" />
                        <p className="text-[var(--color-text-secondary)]">
                            No notifications
                        </p>
                        <p className="text-[var(--color-text-muted)] text-sm mt-1">
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--color-border-default)]">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-(--color-brand-primary-100) transition-colors ${
                                    !notification.read
                                        ? "bg-[var(--color-brand-primary-50)]"
                                        : ""
                                }`}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-text-primary text-sm font-medium">
                                                {notification.title}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    removeNotification(
                                                        notification.id
                                                    )
                                                }
                                                className="flex-shrink-0 p-1 hover:bg-[var(--color-brand-primary-200)] rounded transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3 text-[var(--color-text-tertiary)]" />
                                            </button>
                                        </div>
                                        <p className="text-[var(--color-text-tertiary)] text-xs mt-1">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[var(--color-text-muted)] text-xs">
                                                {formatTime(
                                                    notification.timestamp
                                                )}
                                            </span>
                                            {!notification.read && (
                                                <button
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                    className="text-xs text-[var(--color-info)] hover:underline"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-[var(--color-border-default)]">
                    <button
                        onClick={clearAll}
                        className="w-full text-center text-sm text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors"
                    >
                        Clear all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
