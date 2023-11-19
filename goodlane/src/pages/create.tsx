import { useEffect, useState } from 'react';
import { useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';

import { factoryAbi } from '../abis/factoryAbi';
import DatePicker from '../components/DatePicker';

export default function Create() {
  const [grantDetails, setGrantDetails] = useState({
    name: '',
    desc: '',
    banner: '',
    chain_id: 0,
    targetNumber: 0,
    date: new Date(),
    id: 0,
  });
  type EthereumAddress = `0x${string}`;

  console.log(grantDetails);

  const { chain } = useNetwork(); // useNetwork hook from wagmi to get current network information

  useEffect(() => {
    if (chain?.id) {
      setGrantDetails((prevDetails) => ({ ...prevDetails, chain_id: chain.id }));
    }
  }, [chain]);

  interface ChainIdToAddress {
    [key: number]: EthereumAddress;
  }

  const ChainIdToAddress: ChainIdToAddress = {
    5: (process.env.NEXT_PUBLIC_GOERLI_FACTORY as EthereumAddress) ?? '',
    421613: (process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_FACTORY as EthereumAddress) ?? '',
    1442: (process.env.NEXT_PUBLIC_POLYGON_ZKEVM_FACTORY as EthereumAddress) ?? '',
    534351: (process.env.NEXT_PUBLIC_SCROLL_FACTORY as EthereumAddress) ?? '',
    84531: (process.env.NEXT_PUBLIC_BASE_FACTORY as EthereumAddress) ?? '',
  };

  const factoryAddress = ChainIdToAddress[grantDetails.chain_id];
  console.log(factoryAddress);

  const { config } = usePrepareContractWrite({
    address: factoryAddress ?? undefined,
    abi: factoryAbi,
    functionName: 'createDonationCampaign',
    args: [
      grantDetails.targetNumber,
      grantDetails.name,
      grantDetails.desc,
      grantDetails.banner,
      Math.floor(grantDetails.date.getTime() / 1000),
    ],
  });

  const { write } = useContractWrite(config);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setGrantDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="project-name"
            >
              Project Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="project-name"
              type="text"
              name="name"
              value={grantDetails.name}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="banner-link"
            >
              Banner Link
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="banner-link"
              type="text"
              name="banner"
              value={grantDetails.banner}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none"
              id="description"
              name="desc"
              value={grantDetails.desc}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="banner-link"
            >
              Target Amount
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="target-number"
              type="number"
              name="targetNumber"
              value={grantDetails.targetNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <DatePicker
              endDate={grantDetails.date}
              setEndDate={(date) => setGrantDetails((prev) => ({ ...prev, date }))}
            />
          </div>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/3">
            <button
              className="shadow bg-teal-400 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() => write?.()}
            >
              Post
            </button>
          </div>
          <div className="md:w-2/3"></div>
        </div>
      </form>
    </main>
  );
}
