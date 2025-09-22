import type { TrendingResponse,CoinPriceData, SearchResponse } from "../dto/coingecko-types";

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


export async function searchCoins(query: string): Promise<CoinPriceData[]> {
    if (!query.trim()) return [];
    
    // First get search results to get coin IDs
    const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`);
    if (!searchRes.ok) throw new Error("Failed to search coins");
    
    const searchData: SearchResponse = await searchRes.json();
    if (!searchData.coins?.length) return [];
    
    // Get detailed price data for the first 20 results
    const coinIds = searchData.coins.slice(0, 20).map(coin => coin.id);
    const ids = coinIds.join(',');
    
    const priceRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`
    );
    
    if (!priceRes.ok) throw new Error("Failed to fetch coin prices");
    return priceRes.json();
}