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
    value?: number,
    currentPrice?: number
}

export interface coinsForDoughnutChart {
    name: string;
    short_form: string;
    value: number;
    color: string;
    holding: number;
    price: number;
  };


  export interface CoinPriceData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    sparkline_in_7d: {
        price: number[];
    };
    total_volume: number;
    image: string;
}