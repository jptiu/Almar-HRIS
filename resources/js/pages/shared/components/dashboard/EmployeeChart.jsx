import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { useFetchEmployeesByDeptQuery } from "./hooks";
import { EmployeeChartSkeleton } from ".";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const description = "Employees by department";

// helper → convert API response to chart format
const mapDeptToChart = (data = []) => {
    return data
        .filter((d) => d.employee_count > 0) // hide empty depts
        .map((dept, index) => ({
            department: dept.name.toLowerCase().replace(/\s+/g, "-"),
            label: dept.name,
            employees: dept.employee_count,
            fill: `var(--chart-${index + 1})`,
        }));
};

export function EmployeeChart() {
    const id = "employee-pie";

    const { data, isLoading, error } = useFetchEmployeesByDeptQuery();

    const employeeData = React.useMemo(() => {
        return mapDeptToChart(data?.employees_by_department);
    }, [data]);

    const chartConfig = React.useMemo(() => {
        const config = {};
        employeeData.forEach((dept, i) => {
            config[dept.department] = {
                label: dept.label,
                color: `var(--chart-${i + 1})`,
            };
        });
        return config;
    }, [employeeData]);

    const [activeDept, setActiveDept] = React.useState(
        employeeData?.[0]?.department ?? "",
    );

    React.useEffect(() => {
        if (employeeData?.length) {
            setActiveDept(employeeData[0].department);
        }
    }, [employeeData]);

    const activeIndex = React.useMemo(
        () => employeeData.findIndex((item) => item.department === activeDept),
        [employeeData, activeDept],
    );

    const departments = employeeData.map((item) => item.department);

    if (isLoading) {
        return <EmployeeChartSkeleton />;
    }

    if (error) {
        return (
            <Card className="p-6 text-sm text-muted-foreground">
                Failed to load employee chart
            </Card>
        );
    }

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />

            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <CardTitle>Employees by Department</CardTitle>

                <Select value={activeDept} onValueChange={setActiveDept}>
                    <SelectTrigger
                        size="lg"
                        className="ml-auto h-20 w-44 rounded-lg pl-2.5"
                        aria-label="Select department"
                    >
                        <SelectValue placeholder="Select department" />
                    </SelectTrigger>

                    <SelectContent align="end" className="rounded-xl">
                        {departments.map((key) => {
                            const config = chartConfig[key];
                            if (!config) return null;

                            return (
                                <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="h-3 w-3 rounded-xs"
                                            style={{
                                                backgroundColor: config.color,
                                            }}
                                        />
                                        {config.label}
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-75"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        <Pie
                            data={employeeData}
                            dataKey="employees"
                            nameKey="department"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={({ outerRadius = 0, ...props }) => (
                                <g>
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 10}
                                    />
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 25}
                                        innerRadius={outerRadius + 12}
                                    />
                                </g>
                            )}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (!employeeData[activeIndex]) return null;

                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {
                                                    employeeData[activeIndex]
                                                        .employees
                                                }
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Employees
                                            </tspan>
                                        </text>
                                    );
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
