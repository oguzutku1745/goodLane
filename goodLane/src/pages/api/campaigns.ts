// pages/api/campaigns.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { factoryAbi } from '@/abis/factoryAbi';
import { campaignAbi } from '@/abis/campaignAbi'; // Replace with your campaign contract ABI

type CampaignData = {
    address: string;
    campaignEnded: boolean;
};

type Data = {
    campaigns?: CampaignData[];
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli');
    const factoryContract = new ethers.Contract('0x69BE8125331b0515559127fCD444F7028d4eac13', factoryAbi, provider);

    try {
        const campaignAddresses = await factoryContract.getDeployedCampaigns();
        const campaignDetails = await Promise.all(
            campaignAddresses.map(async (address: string) => {
                const campaignContract = new ethers.Contract(address, campaignAbi, provider);
                const campaignEnded = await campaignContract.campaignEnded();
                return { address, campaignEnded };
            })
        );

        res.status(200).json({ campaigns: campaignDetails });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
