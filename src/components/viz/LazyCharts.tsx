import { ComponentProps, lazy, Suspense } from "react";

// recharts is large, so these charts load after the page; the placeholders keep their height.
const BalanceComparisonChartView = lazy(() => import("@/components/charts/BalanceComparisonChartView"));
const BreakEvenChartView = lazy(() => import("@/components/charts/BreakEvenChartView"));

export const BalanceComparisonChart = (props: ComponentProps<typeof BalanceComparisonChartView>) => (
  <Suspense fallback={<div className="h-[290px] sm:h-[350px]" aria-hidden="true" />}>
    <BalanceComparisonChartView {...props} />
  </Suspense>
);

export const BreakEvenChart = (props: ComponentProps<typeof BreakEvenChartView>) => (
  <Suspense fallback={<div className="h-[270px] sm:h-[330px]" aria-hidden="true" />}>
    <BreakEvenChartView {...props} />
  </Suspense>
);

