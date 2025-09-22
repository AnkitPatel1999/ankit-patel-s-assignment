import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { WatchListItem } from "../../dto/coingecko-types"
import { loadWatchlist } from "../../utilities/watchlist"
import type { CoinPriceData } from "../../dto/coingecko-types"



export const WatchList = createSlice({
    name: 'watchlist',
    initialState: {
        coins: loadWatchlist(),
        lastUpdated: null as Date | null
    },
    reducers: {
        setLastUpdated: (state) => {
            state.lastUpdated = new Date();
        },

        addToWatchList: (state, action: PayloadAction<WatchListItem[]>) => {
            // Add only unique coins by symbol
            const existingSymbols = new Set(state.coins.map(item => item.symbol));
            const newCoins = action.payload.filter(item => !existingSymbols.has(item.symbol));
            const updated = [...state.coins, ...newCoins];
            try {
                localStorage.setItem('watchlist', JSON.stringify(updated));
            } catch {}
            state.coins = updated;
        },

        removeFromWatchList: (state, action: PayloadAction<{ symbol: string }>) => {
            const updated = state.coins.filter(item => item.symbol !== action.payload.symbol);
            console.log("Updated Watchlist:", updated);
            try {
                localStorage.setItem('watchlist', JSON.stringify(updated));
            } catch {}
            state.coins = updated;
        },

        updateHolding: (state, action: PayloadAction<{ symbol: string, holding: string }>) => {
            const { symbol, holding } = action.payload;
            const updated = state.coins.map(item => {
                if (item.symbol === symbol) {
                    const holdingNum = parseFloat(holding) || 0;
                    const currentPrice = item.currentPrice || parseFloat(item.price.replace(/[$,]/g, '')) || 0;
                    const value = holdingNum * currentPrice;
                    return { ...item, holding, value, currentPrice };
                }
                return item;
            });
            try {
                localStorage.setItem('watchlist', JSON.stringify(updated));
            } catch {}
            state.coins = updated;
        },

        updatePrices: (state, action: PayloadAction<CoinPriceData[]>) => {
            const priceData = action.payload;
            const updated = state.coins.map(item => {
                const priceInfo = priceData.find(p => p.symbol.toLowerCase() === item.symbol.toLowerCase());
                if (priceInfo) {
                    const holdingNum = parseFloat(item.holding || '0') || 0;
                    const currentPrice = Number(priceInfo.current_price);
                    const value = holdingNum * currentPrice;
                    // Store sparkline data array for Chart.js
                    const sparklineData = priceInfo.sparkline_in_7d?.price || item.sparklineData || [];
                    return {
                        ...item,
                        price: `$${Number(currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
                        price_change_percentage_24h: `${Number(priceInfo.price_change_percentage_24h) >= 0 ? '+' : ''}${Number(priceInfo.price_change_percentage_24h).toFixed(2)}%`,
                        sparkline: item.sparkline, // Keep existing sparkline URL
                        sparklineData: sparklineData, // Add sparkline data for Chart.js
                        total_volume: `$${Number(priceInfo.total_volume).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                        currentPrice,
                        value
                    };
                }
                return item;
            });
            try {
                localStorage.setItem('watchlist', JSON.stringify(updated));
            } catch {}
            state.coins = updated;
            state.lastUpdated = new Date();
        }
    }
});

export const { addToWatchList, removeFromWatchList, updateHolding, updatePrices, setLastUpdated } = WatchList.actions;
export default WatchList.reducer;