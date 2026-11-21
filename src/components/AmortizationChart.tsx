import { ComponentProps, lazy, Suspense } from "react";

// The chart (and recharts) loads only when it's rendered, so it doesn't slow
// down the first view of the page. The placeholder keeps roughly the same height.
const AmortizationChartView = lazy(() => import("./charts/AmortizationChartView"));

const AmortizationChart = (props: ComponentProps<typeof AmortizationChartView>) => (
  <Suspense fallback={<div className="viz-card h-[520px] sm:h-[560px]" aria-hidden="true" />}>
    <AmortizationChartView {...props} />
  </Suspense>
);

export default AmortizationChart;
