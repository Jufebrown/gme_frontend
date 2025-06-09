
export async function fetchAlphaVantage(symbol = "GME") {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const raw = data["Time Series (Daily)"];
  if (!raw) {
    console.error("Alpha Vantage error:", data);
    return [];
  }

  return Object.entries(raw)
  .map(([date, entry]: [string, any]) => ({
    time: date,
    open: parseFloat(entry["1. open"]),
    high: parseFloat(entry["2. high"]),
    low: parseFloat(entry["3. low"]),
    close: parseFloat(entry["4. close"]), // keep for charting
    volume: parseInt(entry["6. volume"], 10),
  }))
  .reverse();
  
}
