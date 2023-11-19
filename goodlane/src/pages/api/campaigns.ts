import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

import { campaignAbi } from '../../abis/campaignAbi';
import { factoryAbi } from '../../abis/factoryAbi';

type CampaignData = {
  address: string;
  campaignEnded: boolean;
  campaignId: string;
  campaignDesc: string;
  campaignDeadline: string;
  campaignName: string;
  campaignImage: string;
  campaignAmount: string;
  campaignOwner: string;
  providerName: string;
};

type Data = {
  campaigns?: CampaignData[];
  error?: string;
};

const providerConfigs = [
  {
    name: 'goerli',
    provider: new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_GOERLI_PROVIDER),
    factoryAddress: process.env.NEXT_PUBLIC_GOERLI_FACTORY,
  },
  {
    name: 'scroll',
    provider: new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_SCROLL_PROVIDER),
    factoryAddress: process.env.NEXT_PUBLIC_SCROLL_FACTORY,
  },
  {
    name: 'arbitrum',
    provider: new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_PROVIDER,
    ),
    factoryAddress: process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_FACTORY,
  },
  {
    name: 'polygon_zkevm',
    provider: new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_ZKEVM_PROVIDER),
    factoryAddress: process.env.NEXT_PUBLIC_POLYGON_ZKEVM_FACTORY,
  },
  {
    name: 'base',
    provider: new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_PROVIDER),
    factoryAddress: process.env.NEXT_PUBLIC_BASE_FACTORY,
  },
  //{ name: 'mantle', provider: new ethers.providers.JsonRpcProvider(process.env.MANTLE_PROVIDER) },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const campaignsFromAllProviders = await Promise.all(
      providerConfigs.map(({ name, provider, factoryAddress }) =>
        fetchCampaignData(name, provider, factoryAddress ?? ''),
      ),
    );
    const combinedCampaignData = campaignsFromAllProviders.flat();

    res.status(200).json({ campaigns: combinedCampaignData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function fetchCampaignData(
  providerName: string,
  provider: ethers.providers.JsonRpcProvider,
  factoryAddress: string,
) {
  const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);

  const campaignAddresses = await factoryContract.getDeployedCampaigns();
  return Promise.all(
    campaignAddresses.map(async (address: string) => {
      const campaignContract = new ethers.Contract(address, campaignAbi, provider);
      const campaignEnded = await campaignContract.campaignEnded();
      const campaignId = await campaignContract.campaignID();
      const campaignDesc = await campaignContract.description();
      const campaignDeadline = await campaignContract.endDate();
      const campaignName = await campaignContract.name();
      const campaignImage = await campaignContract.imageLink();
      const campaignAmount = await campaignContract.targetAmount();
      const campaignOwner = await campaignContract.owner();

      return {
        address,
        campaignEnded,
        campaignId: campaignId.toString(),
        campaignDesc,
        campaignDeadline: campaignDeadline.toString(),
        campaignName,
        campaignImage,
        campaignAmount: campaignAmount.toString(),
        campaignOwner,
        providerName, // Include the provider name in the campaign data
      };
    }),
  );
}
