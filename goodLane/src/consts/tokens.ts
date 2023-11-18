import { WarpTokenConfig } from "../features/tokens/types";

export const tokenList: WarpTokenConfig = [
    // Example collateral token for an EVM chain
    {
        chainId: 5,
        name: "goerli",
        symbol: "ETH",
        decimals: 18,
        type: "native",
        hypNativeAddress: "0x8CB83E21377E289E0e80fDdF70b50E4cB077Ad18",
    },
    // Example native token for an EVM chain
    // {
    //   type: 'native',
    //   chainId: 11155111,
    //   name: 'Ether',
    //   symbol: 'ETH',
    //   decimals: 18,
    //   hypNativeAddress: '0xEa44A29da87B5464774978e6A4F4072A4c048949',
    //   logoURI: '/logos/weth.png',
    // },
    // Example NFT (ERC721) token for an EVM chain
];
