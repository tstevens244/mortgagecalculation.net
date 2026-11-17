import { ComponentProps, lazy, Suspense } from "react";

// The chart (and recharts) loads only when it's rendered, so it doesn't slow
// down the first view of the page. The placeholder keeps the same height.
const AmortizationChartView = lazy(() => import("./charts/AmortizationChartView"));

const AmortizationChart = (props: ComponentProps<typeof AmortizationChartView>) => (
  <Suspense fallback={<div className="h-[280px] sm:h-[400px]" aria-hidden="true" />}>
    <AmortizationChartView {...props} />
  </Suspense>
);

export default AmortizationChart;
