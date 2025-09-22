export interface TrendingCoin {
    item: {
        id: string;
        coin_id: number;
        name: string;
        symbol: string;
        market_cap_rank: number;
        thumb: string;
        small: string;
        large: string;
        slug: string;
        price_btc: number;
        score: number;
    };
}

export interface TrendingResponse {
    coins: TrendingCoin[];
}

export interface WatchListItem {
    small: string,
    name: string,
    symbol: string,
    price: string,
    price_change_percentage_24h: string,
    sparkline: string,
    total_volume: string,
    total_volume_btc: string,
    holding?: string,
    value?: number
}

export interface coinsForDoughnutChart {
    name: string;
    short_form: string;
    value: number;
    color: string;
    holding: number;
    price: number;
  };