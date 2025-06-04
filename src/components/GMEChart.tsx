"use client";
import { createChart, LineSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";

export default function GMEChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:4000/api/gme");
      const data = await res.json(); // { time: '2024-06-01', value: 123.45 }

      const chart = createChart(chartRef.current!, {
        width: 600,
        height: 400,
      });

      const series = chart.addSeries(LineSeries, {
        color: "#FF0000", // Red color for GME
        lineWidth: 2,
      });
      series.setData(data);

      return () => chart.remove();
    }

    load();
  }, []);

  return <div ref={chartRef} />;
}
