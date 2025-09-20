import "./header.css"

import logo from '../../assets/logo.svg'
import wallet from '../../assets/wallet.svg'

export default function Header() {
    return (
        <>
        <div className='ae-d-flex ae-justify-space-between ae-align-center cu-header'>
            <div className='ae-d-flex ae-align-center ae-gap-10'>
                <img src={logo} alt="Logo" />
                <div className="cu-header-title">Token Portfolio</div>
            </div>
            <div className='ae-d-flex'>
                <button className='ae-btn ae-btn-green ae-d-flex ae-gap-5'>
                    <img className='ae-btn-icon' src={wallet} alt="wallet icon" />
                    <div className="ae-btn-text">Connect Wallet</div>
                </button>
            </div>
        </div>
            
            
        </>
    )   
}
