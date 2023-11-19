export const factoryAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'campaignAddress', type: 'address' },
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'targetAmount', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'string', name: 'description', type: 'string' },
      { indexed: false, internalType: 'string', name: 'imageLink', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'endDate', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'campaignID', type: 'uint256' },
    ],
    name: 'CampaignCreated',
    type: 'event',
  },
  {
    inputs: [],
    name: '_campaignIDCounter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_targetAmount', type: 'uint256' },
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'string', name: '_imageLink', type: 'string' },
      { internalType: 'uint256', name: '_endDate', type: 'uint256' },
    ],
    name: 'createDonationCampaign',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'deployedCampaigns',
    outputs: [{ internalType: 'contract DonationCampaign', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDeployedCampaigns',
    outputs: [{ internalType: 'contract DonationCampaign[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];
