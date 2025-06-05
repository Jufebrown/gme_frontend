"use client";
import { useEffect, useRef } from "react";
import { createChart, LineSeries } from "lightweight-charts";

export default function GMEChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:4000/api/gme");
      console.log('res', res)
      const data = await res.json();
      console.log('data', data)

      const chart = createChart(chartRef.current!, {
        width: 600,
        height: 400,
      });

      const series = chart.addSeries(LineSeries, {
        color: "#FF6347",
        lineWidth: 2,
      });

      series.setData(data);

      return () => chart.remove();
    }

    load();
  }, []);

  return <div ref={chartRef} />;
}
