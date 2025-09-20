import React from 'react';
import './TokenModal.css';

interface TokenModalProps {
  open: boolean;
  onClose: () => void;
}

const tokens = [
  { name: 'Not Coin', symbol: 'NOT', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
  { name: 'Ethereum', symbol: 'ETH', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
  { name: 'Hyperliquid', symbol: 'HYPE', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png' },
  { name: 'PinLink', symbol: 'PIN', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3.png' },
  { name: 'Stader', symbol: 'SD', img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4.png' },
];

export default function TokenModal({ open, onClose }: TokenModalProps) {
  if (!open) return null;
  return (
    <>
      <div className="cu-modal-backdrop" onClick={onClose} />
      <div className="cu-modal">
        <div className="cu-modal-header">
          <input className="cu-modal-search" placeholder="Search tokens (e.g., ETH, SOL)..." />
        </div>
        <div className="cu-modal-list">
          <div className="cu-modal-trending">Trending</div>
          {tokens.map((token, idx) => (
            <div className="cu-modal-token-row" key={idx}>
              <img src={token.img} alt={token.name} className="cu-modal-token-logo" />
              <span>{token.name} ({token.symbol})</span>
              <span className="cu-modal-radio" />
            </div>
          ))}
        </div>
        <div className="cu-modal-footer">
          <button className="cu-modal-add-btn" disabled>Add to Wishlist</button>
        </div>
      </div>
    </>
  );
}
