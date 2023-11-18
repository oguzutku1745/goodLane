import { PropsWithChildren, useMemo } from 'react';
import { ProtocolType } from '@hyperlane-xyz/utils';
import { tokenList } from '../../consts/tokens';
import { getMultiProvider } from '../multiProvider';

export function EvmWalletContext({ children }: PropsWithChildren<{}>) {
  const initialChain = useMemo(() => {
    const multiProvider = getMultiProvider();
    return tokenList.filter(
      (token) =>
        multiProvider.tryGetChainMetadata(token.chainId)?.protocol === ProtocolType.Ethereum,
    )?.[0]?.chainId as number;
  }, []);
  return (
    <>{children}</>
  );
}
