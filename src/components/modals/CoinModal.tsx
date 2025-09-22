import { useEffect, useState, useCallback } from 'react';
import './CoinModal.css';
import { fetchTrendingCoins, searchCoins  } from '../../utilities/coingecko-api';
import type {  TrendingResponse , SearchResponse} from '../../dto/coingecko-types';
import star from "./../../assets/star.svg";
import { useDispatch } from 'react-redux';
import { addToWatchList } from '../../features/watchlist/watchlist-slice';


interface CoinModalProps {
    open: boolean;
    onClose: () => void;
}


const chartColors = [
    "#10B981", "#A78BFA", "#60A5FA", "#18C9DD", "#FB923C", "#FB7185",
    "#B9FF66", "#FFD700", "#FFB6C1", "#00CED1", "#FF7F50", "#7FFF00",
    "#FF69B4", "#6495ED", "#FF4500", "#40E0D0", "#DA70D6", "#32CD32",
    "#FFDAB9", "#BA55D3", "#87CEEB", "#FF6347", "#3CB371", "#FF1493",
    "#1E90FF", "#ADFF2F", "#FF8C00", "#20B2AA", "#9370DB", "#98FB98"
];

export default function CoinModal({ open, onClose }: CoinModalProps) {
    if (!open) return null;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [trendingCoins, setTrendingCoins] = useState<TrendingResponse | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [selectedCoinIds, setSelectedCoinIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const watchlistDispatch = useDispatch();

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId: NodeJS.Timeout;
            return (query: string) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(async () => {
                    if (query.trim()) {
                        setIsSearching(true);
                        try {
                            const results = await searchCoins(query);
                            setSearchResults(results);
                        } catch (err) {
                            console.error('Search failed:', err);
                            setSearchResults({ coins: [] });
                        } finally {
                            setIsSearching(false);
                        }
                    } else {
                        setSearchResults(null);
                    }
                }, 300); // 300ms debounce
            };
        })(),
        []
    );

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const handleAddToWishlist = () => {
        let usedColors: string[] = [];
        try {
            const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
            usedColors = watchlist.map((coin: any) => coin.chart_color || coin.chartColor).filter(Boolean);
        } catch {}

        let selectedCoins: any[] = [];

        // Handle trending coins
        if (trendingCoins?.coins) {
            const trendingSelected = trendingCoins.coins
                .filter(coin => selectedCoinIds.includes(coin.item.coin_id))
                .map(coin => {
                    const chartColor = chartColors.find(c => !usedColors.includes(c)) || chartColors[0];
                    usedColors.push(chartColor);
                    return {
                        small: coin.item.small,
                        name: coin.item.name,
                        symbol: coin.item.symbol,
                        price: new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(coin.item.data.price),
                        price_change_percentage_24h: new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(coin.item.data.price_change_percentage_24h.aed),
                        sparkline: coin.item.data.sparkline,
                        total_volume: coin.item.data.total_volume,  
                        total_volume_btc: new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(coin.item.data.total_volume_btc),
                        chart_color: chartColor,
                    };
                });
            selectedCoins = [...selectedCoins, ...trendingSelected];
        }

        // Handle search results
        if (searchResults?.coins) {
            const searchSelected = searchResults.coins
                .filter(coin => selectedCoinIds.includes(coin.market_cap_rank))
                .map(coin => {
                    const chartColor = chartColors.find(c => !usedColors.includes(c)) || chartColors[0];
                    usedColors.push(chartColor);
                    return {
                        small: coin.thumb,
                        name: coin.name,
                        symbol: coin.symbol,
                        price: '$0.00',
                        price_change_percentage_24h: '0.00%',
                        sparkline: '',
                        total_volume: '0',
                        total_volume_btc: '0.00',
                        chart_color: chartColor,
                    };
                });
            selectedCoins = [...selectedCoins, ...searchSelected];
        }

        if (selectedCoins.length > 0) {
            watchlistDispatch(addToWatchList(selectedCoins));
            onClose();
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchTrendingCoins().then((res) => {
            setIsLoading(false);
            if (res?.coins?.length > 0) {
                setTrendingCoins(res);
            }
        }).catch(() => {
            setIsLoading(false);
            setError("Failed to load trending coins, please try after having a coffee.");
        });
    }, []);

    // Reset search state when modal closes
    useEffect(() => {
        if (!open) {
            setSearchQuery('');
            setSearchResults(null);
            setSelectedCoinIds([]);
        }
    }, [open]);

    return (
        <>
            <div className="cu-modal-backdrop" onClick={onClose} />
            <div className="cu-modal">
                <div className="cu-modal-header">
                    <input 
                        className="cu-modal-search" 
                        placeholder="Search tokens (e.g., ETH, SOL)..." 
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="cu-modal-trending">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending'}
                </div>
                <div className="cu-modal-list">
                    {/* Loading states */}
                    {(isLoading || isSearching) && Array.from({ length: 7 }, (_, index) => (
                        <div className="cu-modal-token-row cu-modal-pending-error-nodata-row" key={`shimmer-${index}`}>
                            <div className="ae-shimmer cu-shimmer-thumb"></div>
                            <div className="ae-shimmer cu-shimmer-coin-name"></div>
                            <div className="ae-shimmer cu-shimmer-radio-btn"></div>
                        </div>
                    ))}

                    {/* Error states */}
                    {error && <p className="cu-modal-token-row cu-modal-pending-error-nodata-row">Error: {error}</p>}
                    
                    {/* No results states */}
                    {!isLoading && !isSearching && !error && searchQuery && !searchResults?.coins?.length && (
                        <p className="cu-modal-token-row cu-modal-pending-error-nodata-row">No coins found for "{searchQuery}".</p>
                    )}
                    {!isLoading && !isSearching && !error && !searchQuery && !trendingCoins?.coins?.length && (
                        <p className="cu-modal-token-row cu-modal-pending-error-nodata-row">No trending coins available.</p>
                    )}

                    {/* Search Results */}
                    {searchResults?.coins?.map((coin) => {
                        const isChecked = selectedCoinIds.includes(coin.market_cap_rank);
                        
                        const handleToggle = () => {
                            setSelectedCoinIds((prev) =>
                                isChecked
                                    ? prev.filter(id => id !== coin.market_cap_rank)
                                    : [...prev, coin.market_cap_rank]
                            );
                        };

                        return (
                            <div
                                className={`cu-modal-token-row${isChecked ? ' checked' : ''}`}
                                key={`search-${coin.id}`}
                                style={{ cursor: 'pointer' }}
                                onClick={handleToggle}
                            >
                                <img 
                                    src={coin.thumb} 
                                    alt={coin.name} 
                                    className="cu-modal-token-logo" 
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            "https://ui-avatars.com/api/?name=" + encodeURIComponent(coin.symbol) + "&background=random&size=32";
                                    }} />
                                <span className='cu-modal-token-name'>{coin.name} ({coin.symbol})</span>

                                <div className='cu-modal-checkedbox'>
                                    {isChecked && (<img className='cu-modal-token-star' src={star} alt="star" />)}
                                    <input
                                        type="checkbox"
                                        className="cu-modal-checkbox-input"
                                        name={`coin-id-${coin.market_cap_rank}`}
                                        id={coin.market_cap_rank.toString()}
                                        checked={isChecked}
                                        onChange={e => e.stopPropagation()}
                                        tabIndex={-1}
                                    />
                                    <span className="cu-modal-checkbox">
                                        {isChecked && (
                                            <svg viewBox="0 0 20 20">  <polyline points="6 10 9 13 14 7" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> </svg>
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Trending Results (only show when not searching) */}
                    {!searchQuery && trendingCoins?.coins?.map((coin) => {
                        const isChecked = selectedCoinIds.includes(coin.item.coin_id);
                        
                        const handleToggle = () => {
                            setSelectedCoinIds((prev) =>
                                isChecked
                                    ? prev.filter(id => id !== coin.item.coin_id)
                                    : [...prev, coin.item.coin_id]
                            );
                        };

                        return (
                            <div
                                className={`cu-modal-token-row${isChecked ? ' checked' : ''}`}
                                key={`trending-${coin.item.coin_id}`}
                                style={{ cursor: 'pointer' }}
                                onClick={handleToggle}
                            >
                                <img 
                                    src={coin.item.small} 
                                    alt={coin.item.name} 
                                    className="cu-modal-token-logo" 
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            "https://ui-avatars.com/api/?name=" + encodeURIComponent(coin.item.symbol) + "&background=random&size=32";
                                    }} />
                                <span className='cu-modal-token-name'>{coin.item.name} ({coin.item.symbol})</span>

                                <div className='cu-modal-checkedbox'>
                                    {isChecked && (<img className='cu-modal-token-star' src={star} alt="star" />)}
                                    <input
                                        type="checkbox"
                                        className="cu-modal-checkbox-input"
                                        name={`coin-id-${coin.item.coin_id}`}
                                        id={coin.item.coin_id.toString()}
                                        checked={isChecked}
                                        onChange={e => e.stopPropagation()}
                                        tabIndex={-1}
                                    />
                                    <span className="cu-modal-checkbox">
                                        {isChecked && (
                                            <svg viewBox="0 0 20 20">  <polyline points="6 10 9 13 14 7" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> </svg>
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="cu-modal-footer">
                    <button onClick={handleAddToWishlist} className={selectedCoinIds.length === 0? 'ae-btn ae-btn-disabled ae-radius-6' : 'ae-btn ae-btn-green ae-radius-6'} disabled={selectedCoinIds.length === 0}>
                        <div className="ae-btn-text">Add to Wishlist</div>
                    </button>
                </div>
            </div>
        </>
    );
}
