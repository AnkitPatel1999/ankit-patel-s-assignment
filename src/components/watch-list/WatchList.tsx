import { useState, useEffect, useRef } from 'react';
import star from '../../assets/star.svg';
import plus_mini from '../../assets/plus_mini.svg';
import cached from '../../assets/cached.svg';
import ellipsis_horizontal from '../../assets/ellipsis_horizontal.svg';
import trash from '../../assets/trash.svg';
import pencil_square from '../../assets/pencil_square.svg';
import './watchlist.css';
import CoinModal from '../modals/CoinModal';
import { useSelector } from 'react-redux';


export default function WatchList() {
    const [showCoinModal, setShowCoinModal] = useState(false);
    const pageSize = 10;
    const totalResults = 100;
    const totalPages = Math.ceil(totalResults / pageSize);

    // state for dynamic pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate start and end result numbers
    const startResult = (currentPage - 1) * pageSize + 1;
    const endResult = Math.min(currentPage * pageSize, totalResults);


    const coinsWatchlist = useSelector((state: any) => state.watchlist);

    
    // Close dropdown on click outside or inside
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [showDropdown]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className='cu-saperator'></div>
            <div className='ae-d-flex ae-justify-space-between ae-mt-48 ae-m-py-24'>
                <div className='ae-d-flex ae-align-center ae-gap-8 cu-watchlist-header'>
                    <img src={star} alt="Star" />
                    <span>WatchList</span>
                </div>
                <div className='ae-d-flex ae-gap-12'>
                    <button className='ae-btn ae-btn-dark ae-radius-6 ae-d-flex ae-gap-5'>
                        <img className='ae-btn-icon' src={cached} alt="Refresh" />
                        <div className="ae-btn-text ae-white-fg-base-color hidden-phone">Refresh Prices</div>
                    </button>
                    <button className='ae-btn ae-btn-green ae-radius-6 ae-d-flex ae-gap-5' onClick={() => setShowCoinModal(true)}>
                        <img className='ae-btn-icon' src={plus_mini} alt="Plus Mini" />
                        <div className="ae-btn-text">Add Token</div>
                    </button>
                </div>
            </div>
            <div className='ae-mt-20 ae-overflow-auto ae-m-py-24'>
                <div className='cu-watchlist-table'>
                    <div className='cu-watchlist-table-row cu-watchlist-table-header'>
                        <div className='cu-watchlist-table-header-cell'>Token</div>
                        <div className='cu-watchlist-table-header-cell'>Price</div>
                        <div className='cu-watchlist-table-header-cell'>24h %</div>
                        <div className='cu-watchlist-table-header-cell'>Sparkline (7d)</div>
                        <div className='cu-watchlist-table-header-cell'>Holding</div>
                        <div className='cu-watchlist-table-header-cell'>Value</div>
                        <div className='cu-watchlist-table-header-cell'></div>
                    </div>
                    <div className='cu-watchlist-table-body'>

                        { coinsWatchlist && coinsWatchlist.map((coin: any, index: number) => (
                            <div className='cu-watchlist-table-row'>
                                <div className='cu-watchlist-table-data-cell ae-d-flex ae-align-center ae-gap-12'>
                                    <img className='cu-token-logo' src={coin.small} alt={coin.name} />
                                    <div>{coin.name} <span className='ae-dark-fg-subtle-color'>({coin.symbol})</span></div>
                                </div>
                                <div className='cu-watchlist-table-data-cell ae-dark-fg-subtle-color'>{coin.price}</div>
                                <div className='cu-watchlist-table-data-cell ae-dark-fg-subtle-color cu-positive-change'>{coin.price_change_percentage_24h}</div>
                                <div className='cu-watchlist-table-data-cell'><img className='cu-watchlist-sparkline-img' src={coin.sparkline} alt={coin.name} /></div>
                                <div className='cu-watchlist-table-data-cell'>{coin.total_volume}</div>
                                <div className='cu-watchlist-table-data-cell'>{coin.total_volume_btc}</div>
                                <div className='cu-watchlist-table-data-cell ae-d-flex ae-justify-content-right'>
                                    <div className="cu-more-options-wrapper" style={{ position: 'relative' }} ref={dropdownRef}>
                                        <img
                                            src={ellipsis_horizontal}
                                            alt="More Options"
                                            className='cu-more-options-icon'
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setShowDropdown(show => !show);
                                            }}
                                        />
                                        {showDropdown && (
                                            <div className="cu-options-dropdown">
                                                <button className="cu-options-dropdown-item cu-options-edit" tabIndex={0} onClick={() => setShowDropdown(false)}>
                                                    <img src={pencil_square} alt='Edit Holdings' className="cu-options-edit-icon" />Edit Holdings
                                                </button>
                                                <button className="cu-options-dropdown-item cu-options-remove" tabIndex={0} onClick={() => setShowDropdown(false)}>
                                                    <img src={trash} alt='Remove' className="cu-options-remove-icon" />Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            ))
                        }


                    </div>
                    {/* Pagination Info & Controls */}
                    <div className="cu-pagination-info ae-d-flex ae-justify-space-between ae-align-center ae-mt-24">
                        <span className="cu-pagination-results">{startResult} - {endResult} of {totalResults} results</span>
                        <div className="cu-pagination-next-prev-container"> 
                            <span className="cu-pagination-pages">{currentPage} of {totalPages} pages</span>
                            <div className="ae-d-flex ae-justify-center ae-mt-12 ae-gap-16">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={currentPage === 1 ? "cu-pagination-btn ae-dark-fg-disabled-color" : "cu-pagination-btn"}
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "cu-pagination-btn ae-dark-fg-disabled-color" : "cu-pagination-btn"}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Pagination Info & Controls ends*/}
                </div>
            </div>
            {/* Token Modal */}
            <CoinModal open={showCoinModal} onClose={() => setShowCoinModal(false)} />
        </>
    );
}
