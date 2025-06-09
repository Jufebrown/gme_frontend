// pages/index.tsx
import { useEffect, useState } from "react";
import { fetchAlphaVantage } from "@/utils/fetchAlphaVantage";
import { CandlestickSeries, createChart } from "lightweight-charts";

type DataPoint = { time: string; value: number };

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:4000/api/gme");
        const backendData: DataPoint[] = await res.json();

        const isStale =
          backendData.length === 0 ||
          new Date(backendData[0].time) < getMostRecentTradingDate();

        if (isStale) {
          console.log("Falling back to Alpha Vantage...");
          const fresh = await fetchAlphaVantage();
          setData(fresh);

          // Save to backend
          await fetch("http://localhost:4000/api/gme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quotes: fresh }),
          });
        } else {
          setData(backendData);
        }
      } catch (err) {
        console.error("Error loading data", err);
      }
    }


    loadData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const chart = createChart(document.getElementById("chart")!, {
      width: 800,
      height: 400,
      layout: { textColor: 'white', background: { color: '#474747'}},
    });
    console.log('data', data)
    const candleStickSeries = chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' })

    candleStickSeries.setData(data);

    return () => chart.remove();
  }, [data]);

  return (
    <main>
      <h1>GME</h1>
      <div id="chart" />
    </main>
  );
}

function getMostRecentTradingDate(): Date {
  const today = new Date();
  let day = today.getDay();
  if (day === 0) day = 6;
  if (day === 6) today.setDate(today.getDate() - 1);
  return new Date(today.toDateString());
}
