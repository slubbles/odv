"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Technology", value: 35 },
  { name: "Gaming", value: 25 },
  { name: "Art & Design", value: 20 },
  { name: "Sustainability", value: 12 },
  { name: "Other", value: 8 },
]

const COLORS = [
  "oklch(0.55 0.22 25)",
  "oklch(0.65 0.22 25)",
  "oklch(0.75 0.15 25)",
  "oklch(0.50 0.15 25)",
  "oklch(0.60 0.10 25)",
]

export function CategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
