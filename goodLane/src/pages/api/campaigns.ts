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
    const provider = new ethers.JsonRpcProvider('https://goerli.infura.io/v3/774dc13131de491b93419ad07613b6c4');
    const factoryContract = new ethers.Contract('0xCd4e5e4028A14f75FBa499905dFf120AeF6d91EA', factoryAbi, provider);

    try {
        const campaignAddresses = await factoryContract.getDeployedCampaigns();
        console.log(campaignAddresses)
        const campaignDetails = await Promise.all(
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
                    campaignDeadline: campaignDeadline.toString(),
                    campaignDesc,
                    campaignName, 
                    campaignImage, 
                    campaignAmount: campaignAmount.toString(), 
                    campaignOwner 
                };
                
            })
        );

        res.status(200).json({ campaigns: campaignDetails });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
