import type { TrendingResponse } from "../dto/coingecko-types";

export async function fetchTrendingCoins(): Promise<TrendingResponse> {
    const res = await fetch("https://api.coingecko.com/api/v3/search/trending");

    if (!res.ok) throw new Error("Failed to fetch trending coins");
    return res.json();
}
