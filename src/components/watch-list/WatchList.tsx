import { useState, useEffect, useRef } from 'react';
import star from '../../assets/star.svg';
import plus_mini from '../../assets/plus_mini.svg';
import cached from '../../assets/cached.svg';
import ellipsis_horizontal from '../../assets/ellipsis_horizontal.svg';
import trash from '../../assets/trash.svg';
import pencil_square from '../../assets/pencil_square.svg';
import './watchlist.css';
import CoinModal from '../modals/CoinModal';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWatchList, updateHolding, updatePrices } from '../../features/watchlist/watchlist-slice';
import { getCoinGeckoIds, formatCurrency } from '../../utilities/watchlist';
import { fetchCoinPrices } from '../../utilities/coingecko-api';
import SparklineChart from '../sparkline-chart/SparklineChart';


function WatchList() {
    const [showCoinModal, setShowCoinModal] = useState(false);
    const dispatch = useDispatch();
    let coinsWatchlist = useSelector((state: any) => state.watchlist);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const pageSize = 10;
    const totalResults = coinsWatchlist.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

    // state for dynamic pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Calculate start and end result numbers
    const startResult = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endResult = Math.min(currentPage * pageSize, totalResults);


    const paginatedCoins = coinsWatchlist.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Close dropdown on click outside for the open dropdown only
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                openDropdownIndex !== null &&
                dropdownRefs.current[openDropdownIndex] &&
                !dropdownRefs.current[openDropdownIndex]?.contains(event.target as Node)
            ) {
                setOpenDropdownIndex(null);
            }
        }
        if (openDropdownIndex !== null) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [openDropdownIndex]);

    const onRefresh = async () => {
        setIsLoading(true);
        try {
            // Get all coin symbols from watchlist
            const symbols = coinsWatchlist.map((coin: any) => coin.symbol);
            const coinIds = getCoinGeckoIds(symbols);
            
            // Fetch current prices from CoinGecko
            const priceData = await fetchCoinPrices(coinIds);
            
            // Update prices and recalculate values
            dispatch(updatePrices(priceData));
            
            // setCurrentPage(1);
        } catch (error) {
            console.error('Failed to refresh prices:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const removeWatchlist = (symbol: string) => {
        console.log("Removing from watchlist:", symbol);
        dispatch(removeFromWatchList({ symbol }));
        setOpenDropdownIndex(null);
    }

    // Editable holding state per coin
    const [holdingEdits, setHoldingEdits] = useState<{ [symbol: string]: string }>({});
    const [editingCoin, setEditingCoin] = useState<string | null>(null);
    const inputHoldingRef = useRef<HTMLInputElement>(null);

    // Focus input when editingCoin changes
    // Focus input and close on outside click when editingCoin changes
    useEffect(() => {
        if (editingCoin && inputHoldingRef.current) {
            inputHoldingRef.current.focus();
        }
        if (!editingCoin) return;
        function handleClick(event: MouseEvent) {
            const input = inputHoldingRef.current;
            const saveBtn = document.querySelector('.cu-save-btn');
            if (
                input && !input.contains(event.target as Node) &&
                (!saveBtn || !saveBtn.contains(event.target as Node))
            ) {
                setEditingCoin(null);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [editingCoin]);

    // store holding edits
    const saveHolding = (symbol: string) => {
        const value = holdingEdits[symbol];
        dispatch(updateHolding({ symbol, holding: value }))
        setEditingCoin(null);
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
                    <button onClick={onRefresh} className='ae-btn ae-btn-dark ae-radius-6 ae-d-flex ae-gap-5'>
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
                        <div className='cu-watchlist-table-header-cell cu-watchlist-table-holding-cell'>Holding</div>
                        <div className='cu-watchlist-table-header-cell'>Value</div>
                        <div className='cu-watchlist-table-header-cell'></div>
                    </div>
                    <div className='cu-watchlist-table-body'>


                        {isLoading && Array.from({ length: 5 }, (_, index) => (
                            <div className="cu-watchlist-table-row" key={`shimmer-${index}`}>
                                <div className='cu-watchlist-table-data-cell ae-d-flex ae-align-center ae-gap-12'>
                                    <div className="ae-shimmer cu-shimmer-thumb"></div>
                                    <div className="ae-shimmer cu-shimmer-coin-name"></div>
                                </div>
                                <div className='cu-watchlist-table-data-cell'>
                                    <div className="ae-shimmer cu-shimmer-coin-name"></div>
                                </div>

                                <div className='cu-watchlist-table-data-cell'>
                                    <div className="ae-shimmer cu-shimmer-coin-name"></div>
                                </div>

                                <div className='cu-watchlist-table-data-cell'>
                                    <div className="ae-shimmer cu-shimmer-coin-name"></div>
                                </div>

                                <div className='cu-watchlist-table-data-cell'>
                                    <div className="ae-shimmer cu-shimmer-coin-name"></div>
                                </div>

                                <div className='cu-watchlist-table-data-cell'>
                                    <div className="ae-shimmer cu-shimmer-coin-name"></div>
                                </div>


                                <div className='cu-watchlist-table-data-cell ae-d-flex ae-justify-content-right'>
                                    <div className="ae-shimmer cu-shimmer-radio-btn"></div>
                                </div>
                            </div>
                        ))}

                        {(!paginatedCoins || paginatedCoins.length === 0) && (
                            <div>
                                <div className='cu-watchlist-no-data'>
                                    No Token in your watchlist. Click "Add Token" to get started.
                                </div>
                            </div>
                        )}

                        {!isLoading && paginatedCoins && paginatedCoins.map((coin: any, index: number) => (
                            <div className='cu-watchlist-table-row' key={coin.symbol + index}>
                                <div className='cu-watchlist-table-data-cell ae-d-flex ae-align-center ae-gap-12'>
                                    <img className='cu-token-logo' src={coin.small} alt={coin.name} />
                                    <div>{coin.name} <span className='ae-dark-fg-subtle-color'>({coin.symbol})</span></div>
                                </div>
                                <div className='cu-watchlist-table-data-cell ae-dark-fg-subtle-color'>{coin.price}</div>
                                <div className='cu-watchlist-table-data-cell ae-dark-fg-subtle-color cu-positive-change'>{coin.price_change_percentage_24h}</div>
                                <div className='cu-watchlist-table-data-cell'>
                                    {coin.sparklineData && coin.sparklineData.length > 0 ? (
                                        <SparklineChart 
                                            data={coin.sparklineData} 
                                            color={coin.price_change_percentage_24h?.includes('+') ? '#10B981' : '#EF4444'}
                                            width={75}
                                            height={28}
                                        />
                                    ) : (
                                        <img className='cu-watchlist-sparkline-img' src={coin.sparkline} alt={coin.name} />
                                    )}
                                </div>
                                <div className='cu-watchlist-table-data-cell cu-watchlist-table-holding-cell '>
                                    {editingCoin === coin.symbol ? (
                                        <div className='ae-d-flex ae-align-center ae-gap-8'>
                                            <input
                                                ref={inputHoldingRef}
                                                type="number"
                                                value={holdingEdits[coin.symbol] ?? coin.holding}
                                                onChange={e => setHoldingEdits({ ...holdingEdits, [coin.symbol]: e.target.value })}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                                                        saveHolding(coin.symbol);
                                                    }
                                                }}
                                                className="cu-holding-input"
                                                placeholder='Select'
                                                min="0"
                                            />

                                            <button className='ae-btn ae-btn-green ae-radius-6 ae-d-flex ae-gap-5 cu-save-btn' onClick={() => saveHolding(coin.symbol)}>
                                                <div className="ae-btn-text">Save</div>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='ae-d-flex ae-align-center ae-gap-8'
                                            onClick={() => { setEditingCoin(coin.symbol); }}
                                        >
                                            <span>{coin.holding ? coin.holding : '0'}</span>
                                        </div>
                                    )}
                                </div>
                                <div className='cu-watchlist-table-data-cell'>
                                    {coin.value ? formatCurrency(coin.value) : '$0.00'}
                                </div>
                                <div className='cu-watchlist-table-data-cell ae-d-flex ae-justify-content-right'>
                                    <div
                                        className="cu-more-options-wrapper"
                                        style={{ position: 'relative' }}
                                        ref={el => { dropdownRefs.current[index] = el; }}
                                    >
                                        <img
                                            src={ellipsis_horizontal}
                                            alt="More Options"
                                            className='cu-more-options-icon'
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setOpenDropdownIndex(openDropdownIndex === index ? null : index);
                                            }}
                                        />
                                        {openDropdownIndex === index && (
                                            <div className="cu-options-dropdown">
                                                <button
                                                    className="cu-options-dropdown-item cu-options-edit"
                                                    tabIndex={0}
                                                    onClick={e => { e.stopPropagation(); setEditingCoin(coin.symbol); setOpenDropdownIndex(null); }}
                                                >
                                                    <img src={pencil_square} alt='Edit Holdings' className="cu-options-edit-icon" />Edit Holdings
                                                </button>
                                                <button
                                                    className="cu-options-dropdown-item cu-options-remove"
                                                    tabIndex={0}
                                                    onClick={e => { e.stopPropagation(); removeWatchlist(coin.symbol); }}
                                                >
                                                    <img src={trash} alt='Remove' className="cu-options-remove-icon" />Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}


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

export default WatchList;
