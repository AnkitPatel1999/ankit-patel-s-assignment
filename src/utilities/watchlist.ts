import type { WatchListItem } from '../dto/coingecko-types';

// Load from localStorage
export function loadWatchlist(): WatchListItem[] {
    try {
        const data = localStorage.getItem('watchlist');
        if (data) return JSON.parse(data);
    } catch {}
    return [];
}

export function getCoinGeckoIds(symbols: string[]): string[] {
    return symbols.map(symbol => symbol.toLowerCase());
}


// Format currency value
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
