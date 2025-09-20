import star from '../../assets/star.svg';
import plus_mini from '../../assets/plus_mini.svg';
import cached from '../../assets/cached.svg';
import ellipsis_horizontal from '../../assets/ellipsis_horizontal.svg';
import './watchlist.css';

export default function WatchList() {
    return (
        <>
            <div className='ae-d-flex ae-justify-space-between ae-mt-48'>
                <div className='ae-d-flex ae-align-center ae-gap-8 cu-watchlist-header'>
                    <img src={star} alt="Star" />
                    <span>WatchList</span>
                </div>

                <div className='ae-d-flex ae-gap-12'>
                    <button className='ae-btn ae-btn-dark ae-radius-6 ae-d-flex ae-gap-5'>
                        <img className='ae-btn-icon' src={cached} alt="Refresh" />
                        <div className="ae-btn-text ae-white-fg-base-color">Refresh Prices</div>
                    </button>

                    <button className='ae-btn ae-btn-green ae-radius-6 ae-d-flex ae-gap-5'>
                        <img className='ae-btn-icon' src={plus_mini} alt="Plus Mini" />
                        <div className="ae-btn-text">Add Token</div>
                    </button>
                </div>
            </div>


            <div className='ae-mt-20'>
                <div className='cu-watchlist-table'>
                    <div className='cu-watchlist-table-row'>
                        <div className='cu-watchlist-table-header-cell'>Token</div>
                        <div className='cu-watchlist-table-header-cell'>Price</div>
                        <div className='cu-watchlist-table-header-cell'>24h %</div>
                        <div className='cu-watchlist-table-header-cell'>Sparkline (7d)</div>
                        <div className='cu-watchlist-table-header-cell'>Holding</div>
                        <div className='cu-watchlist-table-header-cell'>Value</div>
                        <div className='cu-watchlist-table-header-cell'></div>
                    </div>
                    <div className='cu-watchlist-table-body'>
                        <div className='cu-watchlist-table-row'>
                            <div className='cu-watchlist-table-data-cell ae-d-flex ae-align-center ae-gap-12'>
                                <img className='cu-token-logo' src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" alt="Bitcoin" />
                                <div>Bitcoin <span className='ae-dark-fg-subtle-color'>(BTC)</span></div>
                            </div>
                            <div className='cu-watchlist-table-data-cell ae-dark-fg-subtle-color'>$27,000.00</div>
                            <div className='cu-watchlist-table-data-cell ae-dark-fg-subtle-color cu-positive-change'>+2.5%</div>
                            <div className='cu-watchlist-table-data-cell'>$500B</div>
                            <div className='cu-watchlist-table-data-cell'>$30B</div>
                            <div className='cu-watchlist-table-data-cell'>18.7M BTC</div>
                            <div className='cu-watchlist-table-data-cell ae-d-flex ae-justify-flex-end'>
                                <img src={ellipsis_horizontal} alt="More Options" className='cu-more-options-icon' />
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}
