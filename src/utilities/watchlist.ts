import type { WatchListItem } from '../dto/coingecko-types';

// Load from localStorage
export function loadWatchlist(): WatchListItem[] {
    try {
        const data = localStorage.getItem('watchlist');
        if (data) return JSON.parse(data);
    } catch {}
    return [];
}
    

