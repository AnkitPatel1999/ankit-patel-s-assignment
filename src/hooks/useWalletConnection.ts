import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useDispatch } from 'react-redux';
import { setWalletConnection } from '../features/watchlist/watchlist-slice';

export const useWalletConnection = () => {
  const { address, isConnected, chainId } = useAccount();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setWalletConnection({
      isConnected,
      address: address || null,
      chainId: chainId || null
    }));
  }, [address, isConnected, chainId, dispatch]);

  return { address, isConnected, chainId };
};
