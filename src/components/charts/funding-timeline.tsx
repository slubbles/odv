"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Day 1", amount: 1200 },
  { day: "Day 2", amount: 2400 },
  { day: "Day 3", amount: 4100 },
  { day: "Day 4", amount: 5800 },
  { day: "Day 5", amount: 7200 },
  { day: "Day 6", amount: 8100 },
  { day: "Day 7", amount: 8900 },
]

export function FundingTimeline() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Area type="monotone" dataKey="amount" stroke="oklch(0.55 0.22 25)" fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
