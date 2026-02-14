import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "Employees by department"

const employeeData = [
  { department: "engineering", employees: 186, fill: "var(--color-engineering)" },
  { department: "marketing", employees: 305, fill: "var(--color-marketing)" },
  { department: "sales", employees: 237, fill: "var(--color-sales)" },
  { department: "hr", employees: 173, fill: "var(--color-hr)" },
  { department: "finance", employees: 209, fill: "var(--color-finance)" },
]

const chartConfig = {
  engineering: { label: "Engineering", color: "var(--chart-1)" },
  marketing: { label: "Marketing", color: "var(--chart-2)" },
  sales: { label: "Sales", color: "var(--chart-3)" },
  hr: { label: "HR", color: "var(--chart-4)" },
  finance: { label: "Finance", color: "var(--chart-5)" },
}

export function EmployeeChart() {
  const id = "employee-pie"
  const [activeDept, setActiveDept] = React.useState(employeeData[0].department)

  const activeIndex = React.useMemo(
    () => employeeData.findIndex((item) => item.department === activeDept),
    [activeDept]
  )

  const departments = React.useMemo(
    () => employeeData.map((item) => item.department),
    []
  )

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Employees by Department</CardTitle>
        </div>

        <Select value={activeDept} onValueChange={setActiveDept}>
          <SelectTrigger
            className="ml-auto h-7 w-40 rounded-lg pl-2.5"
            aria-label="Select department"
          >
            <SelectValue placeholder="Select department" />
          </SelectTrigger>

          <SelectContent align="end" className="rounded-xl">
            {departments.map((key) => {
              const config = chartConfig[key]
              if (!config) return null

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: `var(--color-${key})` }}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              )
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
                  <Sector {...props} outerRadius={outerRadius + 10} />
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
                  if (viewBox && viewBox.cx && viewBox.cy) {
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
                          {employeeData[activeIndex].employees}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 24}
                          className="fill-muted-foreground"
                        >
                          Employees
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
