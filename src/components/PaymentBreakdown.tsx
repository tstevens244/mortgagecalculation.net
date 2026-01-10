import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface PaymentBreakdownProps {
  principal: number;
  interest: number;
  tax: number;
  insurance: number;
  pmi: number;
  hoa: number;
}

const PaymentBreakdown = ({ principal, interest, tax, insurance, pmi, hoa }: PaymentBreakdownProps) => {
  const data = [
    { name: "Principal", value: principal, color: "hsl(var(--chart-primary))" },
    { name: "Interest", value: interest, color: "hsl(var(--chart-secondary))" },
    { name: "Property Tax", value: tax, color: "hsl(var(--chart-tertiary))" },
    { name: "Insurance", value: insurance, color: "hsl(var(--chart-quaternary))" },
    ...(pmi > 0 ? [{ name: "PMI", value: pmi, color: "hsl(0 84% 60%)" }] : []),
    ...(hoa > 0 ? [{ name: "HOA", value: hoa, color: "hsl(280 67% 50%)" }] : []),
  ].filter((item) => item.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="chart-container" aria-labelledby="breakdown-heading">
      <h3 id="breakdown-heading" className="text-lg font-semibold mb-4">Monthly Payment Breakdown</h3>
      
      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="h-[300px] sm:h-[350px]" role="img" aria-label="Pie chart showing monthly payment breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
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
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(item.value)}</p>
                <p className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentBreakdown;
