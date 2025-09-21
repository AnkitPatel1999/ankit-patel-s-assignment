import { useEffect, useState, useTransition } from 'react';
import './CoinModal.css';
import { fetchTrendingCoins } from '../../utilities/coingecko-api';
import type { TrendingResponse } from '../../dto/coingecko-types';


interface CoinModalProps {
    open: boolean;
    onClose: () => void;
}

// const tokens = [
//     { name: 'Not Coin', symbol: 'NOT', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
//     { name: 'Ethereum', symbol: 'ETH', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
//     { name: 'Hyperliquid', symbol: 'HYPE', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png' },
//     { name: 'PinLink', symbol: 'PIN', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3.png' },
//     { name: 'Stader', symbol: 'SD', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4.png' },
// ];

export default function CoinModal({ open, onClose }: CoinModalProps) {
    if (!open) return null;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [trendingCoins, setTrendingCoins] = useState<TrendingResponse | []>([]);

    useEffect(() => {
        setIsLoading(true);
        fetchTrendingCoins().then((res) => {
            setIsLoading(false);
            if (res && Array.isArray(res.coins) && res.coins.length > 0) {
                setTrendingCoins(res);
            }
        }).catch((err) => {
            setIsLoading(false);
            setError("Failed to load trending coins, please try after having a coffee.");
        });

    }, []);


    return (
        <>
            <div className="cu-modal-backdrop" onClick={onClose} />
            <div className="cu-modal">
                <div className="cu-modal-header">
                    <input className="cu-modal-search" placeholder="Search tokens (e.g., ETH, SOL)..." />
                </div>
                <div className="cu-modal-trending">Trending</div>
                <div className="cu-modal-list">



                    {isLoading && Array.from({ length: 7 }, (_, index) => (
                        <div className="cu-modal-token-row cu-modal-pending-error-nodata-row">
                            <div className="ae-shimmer cu-shimmer-thumb"></div>
                            <div className="ae-shimmer cu-shimmer-coin-name"></div>
                            <div className="ae-shimmer cu-shimmer-radio-btn"></div>
                        </div>
                    ))}

   
                    {error && <p className="cu-modal-token-row cu-modal-pending-error-nodata-row">Error: {error}</p>}
                    {!isLoading && !error && (!trendingCoins || !trendingCoins.coins) && (
                        <p className="cu-modal-token-row cu-modal-pending-error-nodata-row">No trending coins available.</p>
                    )}


                    {trendingCoins.coins && trendingCoins?.coins.map((coin) => (
                        <div className="cu-modal-token-row" key={`Coin-modal-${coin.item.coin_id}`}>
                            <img 
                                src={coin.item.small} 
                                alt={coin.item.name} 
                                className="cu-modal-token-logo" 
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(coin.item.symbol) + "&background=random&size=32"; // fallback image
                                }} />
                            <span className='cu-modal-token-name'>{coin.item.name} ({coin.item.symbol})</span>
                            <span className="cu-modal-radio" />
                        </div>
                    ))}
                </div>
                <div className="cu-modal-footer">
                    <button className='ae-btn ae-btn-green ae-radius-6'>
                        <div className="ae-btn-text">Add to Wishlist</div>
                    </button>
                </div>
            </div>
        </>
    );
}
