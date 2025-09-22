import type { TrendingResponse,CoinPriceData } from "../dto/coingecko-types";

export async function fetchTrendingCoins(): Promise<TrendingResponse> {
    const res = await fetch("https://api.coingecko.com/api/v3/search/trending");

    if (!res.ok) throw new Error("Failed to fetch trending coins");
    return res.json();
}


export async function fetchCoinPrices(coinIds: string[]): Promise<CoinPriceData[]> {
    if (coinIds.length === 0) return [];
    
    const ids = coinIds.join(',');
    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
    );

    if (!res.ok) throw new Error("Failed to fetch coin prices");
    return res.json();
}