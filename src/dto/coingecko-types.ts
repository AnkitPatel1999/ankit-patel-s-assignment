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
    sparklineData?: number[],
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
    current_price: string;
    price_change_percentage_24h: string;
    sparkline_in_7d: string;
    total_volume: string;
    image: string;
    market_cap_rank: number;
  }


export interface SearchResult {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
}

export interface SearchResponse {
    coins: SearchResult[];
}