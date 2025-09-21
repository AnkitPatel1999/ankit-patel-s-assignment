import { configureStore } from "@reduxjs/toolkit";
import { WatchList } from "../features/watchlist/watchlist-slice";

const store = configureStore({
    reducer: {
        watchlist: WatchList.reducer
    }
});

export default store;
