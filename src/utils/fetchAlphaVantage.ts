
export async function fetchAlphaVantage(symbol = "GME") {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data["Time Series (Daily)"]) {
    console.error("Alpha Vantage error:", data);
    return [];
  }

  return Object.entries(data["Time Series (Daily)"])
    .map(([date, day]: [string, any]) => ({
      time: date,
      value: parseFloat(day["4. close"]),
    }))
    .reverse();
}
