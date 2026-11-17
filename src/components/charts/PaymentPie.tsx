import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/formatters";

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

/** The recharts pie for PaymentBreakdown, split out so recharts loads after the page. */
const PaymentPie = ({ data }: { data: PieSlice[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie isAnimationActive={false} data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" strokeWidth={0}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number) => formatCurrency(value)}
        contentStyle={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.5rem",
        }}
      />
      <Legend
        verticalAlign="bottom"
        height={36}
        formatter={(value: string) => <span className="text-sm text-foreground">{value}</span>}
      />
    </PieChart>
  </ResponsiveContainer>
);

export default PaymentPie;
