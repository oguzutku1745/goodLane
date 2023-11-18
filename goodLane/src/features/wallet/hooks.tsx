
import {
  sendTransaction as sendEvmTransaction,
  switchNetwork as switchEvmNetwork,
} from '@wagmi/core';
import { Provider } from 'ethers';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  useAccount as useEvmAccount,
  useDisconnect as useEvmDisconnect,
  useNetwork as useEvmNetwork,
  useConnect
} from 'wagmi';

import { ProtocolType, sleep } from '@hyperlane-xyz/utils';
import { logger } from '../../utils/logger';
import {
  getCaip2Id,
  getEthereumChainId,
  tryGetProtocolType,
} from '../caip/chains';

interface ChainAddress {
  address: string;
  chainCaip2Id?: ChainCaip2Id;
}

export interface AccountInfo {
  protocol: ProtocolType;
  addresses: Array<{ address: string }>;
  connectorName?: string;
  isReady: boolean;
}

export function useAccounts(): {
  accounts: Record<ProtocolType, AccountInfo>;
  readyAccounts: Array<AccountInfo>;
} {
  // EVM
  const {
    address: evmAddress,
    isConnected: isEvmConnected,
    connector: evmConnector,
  } = useEvmAccount();
  const isEvmAccountReady = !!(evmAddress && isEvmConnected && evmConnector);
  const evmConnectorName = evmConnector?.name;

  const evmAccountInfo: AccountInfo = useMemo(
    () => ({
      protocol: ProtocolType.Ethereum,
      addresses: evmAddress ? [{ address: `${evmAddress}` }] : [],
      connectorName: evmConnectorName,
      isReady: isEvmAccountReady,
    }),
    [evmAddress, evmConnectorName, isEvmAccountReady],
  );

  // Filtered ready accounts
  const readyAccounts = useMemo(
    () => [evmAccountInfo].filter((a) => a.isReady),
    [evmAccountInfo],
  );

  return useMemo(
    () => ({
      accounts: {
        [ProtocolType.Ethereum]: evmAccountInfo,
      } as Record<ProtocolType, AccountInfo>,
      readyAccounts,
    }),
    [evmAccountInfo, readyAccounts],
  );
  }
export function useAccountForChain(chainCaip2Id?: string): AccountInfo | undefined {
  const { accounts } = useAccounts();
  if (!chainCaip2Id) return undefined;
  const protocol = tryGetProtocolType(chainCaip2Id);
  if (!protocol) return undefined;
  return accounts[protocol];
}

export function useAccountAddressForChain(chainCaip2Id?: string): string | undefined {
  return getAccountAddressForChain(chainCaip2Id, useAccountForChain(chainCaip2Id));
}

export function getAccountAddressForChain(
  chainCaip2Id?: string,
  account?: AccountInfo,
): string | undefined {
  if (!chainCaip2Id || !account?.addresses.length) return undefined;
  return (
    account.addresses.find((a) => a.chainCaip2Id === chainCaip2Id)?.address ||
    account.addresses[0].address
  );
}

export function useConnectFns(): Record<ProtocolType, () => void> {
  const { connect, connectors } = useConnect();
  const { isConnected } = useEvmAccount();

  const onConnectEthereum = useCallback(async () => {
    if (!isConnected) {
      // Assuming you want to use the first available connector
      // You might want to add logic to let the user choose a connector
      const connector = connectors[0];
      if (connector) {
        await connect({ connector });
      }
    }
  }, [connect, connectors, isConnected]);

  return useMemo(
    () => ({
      [ProtocolType.Ethereum]: onConnectEthereum,
      [ProtocolType.Sealevel]: () => {}, // Placeholder for Solana
      [ProtocolType.Fuel]: () => {},     // Placeholder for Fuel
      [ProtocolType.Cosmos]: () => {},   // Placeholder for Cosmos
    }),
    [onConnectEthereum],
  );
}

export function useDisconnectFns(): Record<ProtocolType, () => Promise<void>> {
  // EVM
  const { disconnectAsync: disconnectEvm } = useEvmDisconnect();

  const onClickDisconnect =
    (env: ProtocolType, disconnectFn?: () => Promise<void> | void) => async () => {
      try {
        if (!disconnectFn) throw new Error('Disconnect function is null');
        await disconnectFn();
      } catch (error) {
        logger.error(`Error disconnecting from ${env} wallet`, error);
        toast.error('Could not disconnect wallet');
      }
    };

    return useMemo(
      () => ({
        [ProtocolType.Ethereum]: onClickDisconnect(ProtocolType.Ethereum, disconnectEvm),
      } as Record<ProtocolType, () => Promise<void>>),
      [onClickDisconnect, disconnectEvm],
    );
    }
export function useActiveChains(): {
  chains: Record<ProtocolType, { chainDisplayName?: string; chainCaip2Id?: string; }>;
  readyChains: Array<{ chainDisplayName?: string; chainCaip2Id?: string; }>;
} {
  // EVM
  const { chain: evmChainDetails } = useEvmNetwork();
  const evmChain = useMemo(
    () => ({
      chainDisplayName: evmChainDetails?.name,
      chainCaip2Id: evmChainDetails ? getCaip2Id(ProtocolType.Ethereum, evmChainDetails.id) : undefined,
    }),
    [evmChainDetails],
  );

  const readyChains = useMemo(
    () => [evmChain].filter((c) => !!c.chainDisplayName),
    [evmChain],
  );

  return useMemo(
    () => ({
      chains: {
        [ProtocolType.Ethereum]: evmChain,
        // Adding type assertion
      },
      readyChains,
    } as {
      chains: Record<ProtocolType, { chainDisplayName?: string; chainCaip2Id?: string; }>;
      readyChains: Array<{ chainDisplayName?: string; chainCaip2Id?: string; }>;
    }),
    [evmChain, readyChains],
  );
}
export type SendTransactionFn<TxResp = any> = (params: {
  tx: any;
  chainCaip2Id: string;
  activeCap2Id?: string;
}) => Promise<{ hash: string; confirm: () => Promise<TxResp> }>;

export type SwitchNetworkFn = (chainCaip2Id: string) => Promise<void>;

export function useTransactionFns(): Record<
  ProtocolType,
  {
    sendTransaction: SendTransactionFn;
    switchNetwork?: SwitchNetworkFn;
  }
> {
  // EVM
  const onSwitchEvmNetwork = useCallback(async (chainCaip2Id: string) => {
    const chainId = getEthereumChainId(chainCaip2Id);
    await switchEvmNetwork({ chainId });
    await sleep(1500); // Some wallets require a brief pause after switch
  }, []);

  const onSendEvmTx = useCallback(
    async ({
      tx,
      chainCaip2Id,
      activeCap2Id,
    }: {
      tx: any;
      chainCaip2Id: string;
      activeCap2Id?: string;
    }) => {
      if (activeCap2Id && activeCap2Id !== chainCaip2Id) await onSwitchEvmNetwork(chainCaip2Id);
      const chainId = getEthereumChainId(chainCaip2Id);
      logger.debug(`Sending tx on chain ${chainCaip2Id}`);
      const { hash, wait } = await sendEvmTransaction({
        chainId,
        request: tx as Provider.TransactionRequest,
      });
      return { hash, confirm: () => wait(1) };
    },
    [onSwitchEvmNetwork],
  );

  return useMemo(
    () => ({
      [ProtocolType.Ethereum]: { sendTransaction: onSendEvmTx, switchNetwork: onSwitchEvmNetwork },
      // Adding type assertion
    } as Record<ProtocolType, { sendTransaction: SendTransactionFn<any>; switchNetwork?: SwitchNetworkFn; }>),
    [onSendEvmTx, onSwitchEvmNetwork],
  );
}