import "./header.css"
import logo from '../../assets/logo.svg'
import wallet from '../../assets/wallet.svg'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletConnection } from '../../hooks/useWalletConnection';

export default function Header() {
    useWalletConnection();

    return (
        <div className='ae-d-flex ae-justify-space-between ae-align-center cu-header'>
            <div className='ae-d-flex ae-align-center ae-gap-10'>
                <img src={logo} alt="Logo" />
                <div className="cu-header-title">Token Portfolio</div>
            </div>
            <div className='ae-d-flex'>
                <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                        const connected = mounted && account && chain;

                        return (
                            <div {...(!mounted && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                                {!connected ? (
                                    <button onClick={openConnectModal} className='ae-btn ae-btn-green ae-d-flex ae-gap-5'>
                                        <img className='ae-btn-icon' src={wallet} alt="wallet icon" />
                                        <div className="ae-btn-text">Connect Wallet</div>
                                    </button>
                                ) : chain.unsupported ? (
                                    <button onClick={openChainModal} className='ae-btn ae-btn-red ae-d-flex ae-gap-5'>
                                        <img className='ae-btn-icon' src={wallet} alt="wallet icon" />
                                        <div className="ae-btn-text">Wrong network</div>
                                    </button>
                                ) : (
                                    <button onClick={openAccountModal} className='ae-btn ae-btn-green ae-d-flex ae-gap-5'>
                                        <img className='ae-btn-icon' src={wallet} alt="wallet icon" />
                                        <div className="ae-btn-text">{account.displayName}</div>
                                    </button>
                                )}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </div>
        </div>
    );
}
