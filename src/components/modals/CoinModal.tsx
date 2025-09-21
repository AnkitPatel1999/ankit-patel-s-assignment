import { useEffect, useState, useTransition } from 'react';
import './CoinModal.css';
import { fetchTrendingCoins } from '../../utilities/coingecko-api';
import type { TrendingResponse } from '../../dto/coingecko-types';
import star from "./../../assets/star.svg";

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
    const [trendingCoins, setTrendingCoins] = useState<TrendingResponse | null>(null);
    const [selectedCoinIds, setSelectedCoinIds] = useState<number[]>([]);

    useEffect(() => {
        setIsLoading(true);
        fetchTrendingCoins().then((res) => {
            setIsLoading(false);
            if (res && !Array.isArray(res) && 'coins' in res && Array.isArray(res.coins) && res.coins.length > 0) {
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
                        <div className="cu-modal-token-row cu-modal-pending-error-nodata-row" key={`shimmer-${index}`}>
                            <div className="ae-shimmer cu-shimmer-thumb"></div>
                            <div className="ae-shimmer cu-shimmer-coin-name"></div>
                            <div className="ae-shimmer cu-shimmer-radio-btn"></div>
                        </div>
                    ))}

                    {error && <p className="cu-modal-token-row cu-modal-pending-error-nodata-row">Error: {error}</p>}
                    {!isLoading && !error && (!trendingCoins || !trendingCoins.coins) && (
                        <p className="cu-modal-token-row cu-modal-pending-error-nodata-row">No trending coins available.</p>
                    )}

                    {trendingCoins && trendingCoins.coins && trendingCoins.coins.map((coin) => {
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
                                key={`Coin-modal-${coin.item.coin_id}`}
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
                    <button className={selectedCoinIds.length === 0? 'ae-btn ae-btn-disabled ae-radius-6' : 'ae-btn ae-btn-green ae-radius-6'} disabled={selectedCoinIds.length === 0}>
                        <div className="ae-btn-text">Add to Wishlist</div>
                    </button>
                </div>
            </div>
        </>
    );
}
