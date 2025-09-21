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

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [trendingCoins, setTrendingCoins] = useState<TrendingResponse | null>(null);

    useEffect(() => {
        startTransition(() => {
            fetchTrendingCoins().then((res) => {
                if (res && Array.isArray(res.coins) && res.coins.length > 0) {
                    setTrendingCoins(res);
                }
            }).catch((err) => {
                setError("Failed to load trending coins, please try after having a coffee.");
            });
        });

    }, []);


    if (isPending && !trendingCoins) return <p>Loading trending coins...</p>;
    if (error) return <p className="">Error: {error}</p>;
    if (!trendingCoins) return <p>No trending coins available.</p>;

    return (
        <>
            <div className="cu-modal-backdrop" onClick={onClose} />
            <div className="cu-modal">
                <div className="cu-modal-header">
                    <input className="cu-modal-search" placeholder="Search tokens (e.g., ETH, SOL)..." />
                </div>
                <div className="cu-modal-trending">Trending</div>
                <div className="cu-modal-list">



                    {trendingCoins?.coins.map((coin) => (
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
