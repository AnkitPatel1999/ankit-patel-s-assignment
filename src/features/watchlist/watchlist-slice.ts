import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { WatchListItem } from "../../dto/coingecko-types"
import { loadWatchlist } from "../../utilities/watchlist"



export const WatchList = createSlice({
    name: 'watchlist',
    initialState: loadWatchlist(),
    reducers: {
        addToWatchList: (state, action: PayloadAction<WatchListItem[]>) => {
            // Add only unique coins by symbol
            const existingSymbols = new Set(state.map(item => item.symbol));
            const newCoins = action.payload.filter(item => !existingSymbols.has(item.symbol));
            const updated = [...state, ...newCoins];
            try {
                localStorage.setItem('watchlist', JSON.stringify(updated));
            } catch {}
            return updated;
        },
        removeFromWatchList: (state, action: PayloadAction<{ symbol: string }>) => {
            const updated = state.filter(item => item.symbol !== action.payload.symbol);
            try {
                localStorage.setItem('watchlist', JSON.stringify(updated));
            } catch {}
            return updated;
        }
    }
});

export const { addToWatchList, removeFromWatchList } = WatchList.actions;
export default WatchList.reducer;