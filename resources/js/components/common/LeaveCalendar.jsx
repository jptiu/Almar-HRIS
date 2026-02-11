import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui";
import { mockLeaveRequests } from "@/data/mockData";
import { getStatusVariant } from "@/helpers";

function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(
        typeof window !== "undefined" && window.innerWidth < 640,
    );

    React.useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return isMobile;
}

const variantColors = {
    info: { bg: "#3b82f6", border: "#2563eb" },
    success: { bg: "#22c55e", border: "#16a34a" },
    warning: { bg: "#eab308", border: "#ca8a04" },
    danger: { bg: "#ef4444", border: "#dc2626" },
    default: { bg: "#6b7280", border: "#4b5563" },
};

const leaveTypeColors = {
    vacation: { variant: "info" },
    personal: { variant: "success" },
    sick: { variant: "warning" },
    bereavement: { variant: "default" },
    birthday: { variant: "danger" },
    unpaid: { variant: "default" },
};

function LeaveCalendar() {
    const isMobile = useIsMobile();
    const calendarRef = React.useRef(null);
    const containerRef = React.useRef(null);

    const events = React.useMemo(() => {
        return mockLeaveRequests
            .filter((lr) => lr.status === "approved")
            .map((lr) => {
                const variant = getStatusVariant(lr.leaveType);
                const colors = variantColors[variant] || variantColors.default;

                const endDate = new Date(lr.endDate);
                endDate.setDate(endDate.getDate() + 1);

                return {
                    id: lr.id,
                    title: `${lr?.name} — ${
                        lr.leaveType.charAt(0).toUpperCase() +
                        lr.leaveType.slice(1)
                    }`,
                    start: lr.startDate,
                    end: endDate,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    textColor: "#fff",
                    extendedProps: {
                        employeeName: `${lr?.name}`,
                        leaveType: lr.leaveType,
                        reason: lr?.reason,
                    },
                };
            });
    }, []);

    // -------------------------
    // Fix: ResizeObserver to detect container size changes
    // -------------------------
    React.useEffect(() => {
        if (!containerRef.current || !calendarRef.current) return;

        const observer = new ResizeObserver(() => {
            calendarRef.current.getApi().updateSize();
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>Employee Leave Calendar</CardTitle>

                    <div className="flex gap-2 flex-wrap max-w-full">
                        {Object.entries(leaveTypeColors).map(([type, data]) => (
                            <Badge
                                key={type}
                                variant={data.variant}
                                className="text-[10px] sm:text-xs capitalize whitespace-nowrap"
                            >
                                {type}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent ref={containerRef}>
                <style>{`
                    .fc-custom .fc-button {
                        background-color: #1e4579 !important;
                        border-color: #1a3a65 !important;
                        padding: 0.3rem 0.5rem !important;
                        font-size: 0.7rem !important;
                        transition: all 0.2s ease;
                    }
                    .fc-custom .fc-toolbar-title {
                        font-size: 1rem !important;
                        font-weight: 600;
                        color: hsl(215, 27%, 32%);
                    }
                    .fc-custom .fc-event {
                        border-radius: 4px;
                    }
                    @media (max-width: 640px) {
                        .fc-custom .fc-toolbar {
                            flex-direction: column;
                            gap: 0.4rem;
                        }
                        .fc-custom .fc-toolbar-title {
                            font-size: 0.9rem !important;
                            text-align: center;
                        }
                        .fc-custom .fc-daygrid-day-number {
                            font-size: 0.65rem;
                        }
                        .fc-custom .fc-daygrid-event {
                            margin-top: 1px;
                        }
                    }
                `}</style>

                <div className="fc-custom">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek",
                        }}
                        buttonText={{
                            today: "Today",
                            month: "Month",
                            week: "Week",
                        }}
                        events={events}
                        height="auto"
                        dayMaxEvents={isMobile ? 2 : 3}
                        eventDisplay="block"
                        nowIndicator
                        eventContent={(arg) => (
                            <div className="px-1 py-0.5 text-[9px] sm:text-xs truncate font-medium">
                                {isMobile
                                    ? arg.event.extendedProps.employeeName
                                    : arg.event.title}
                            </div>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export { LeaveCalendar };
