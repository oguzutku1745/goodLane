import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';

interface GrantProps {
  address: string;
  campaignAmount: string;
  campaignDesc: string;
  campaignEnded: boolean;
  campaignName: string;
  campaignId: string;
  campaignImage: string;
  campaignOwner: string;
  campaignDeadline: string;
  providerName: string;
}

const GrantCard: FC<GrantProps> = ({
  address,
  campaignAmount,
  campaignDeadline,
  campaignName,
  campaignDesc,
  campaignEnded,
  campaignId,
  campaignImage,
  campaignOwner,
  providerName,
}) => {
  const [imgSrc, setImgSrc] = useState(campaignImage);

  const handleCardClick = () => {
    const campaignData = {
      address,
      campaignAmount,
      campaignDeadline,
      campaignDesc,
      campaignEnded,
      campaignId,
      campaignImage,
      campaignOwner,
    };
    localStorage.setItem('selectedCampaign', JSON.stringify(campaignData));
  };

  const handleError = () => {
    setImgSrc('/broken-image.jpg'); // Set this to your fallback image path
  };

  const getProviderImage = (name: string) => {
    switch (name) {
      case 'goerli':
        return '/ethereum-eth-logo.svg'; // Replace with actual paths
      case 'scroll':
        return '/scroll.svg';
      case 'arbitrum':
        return '/arbitrum-arb-logo.svg';
      case 'polygon_zkevm':
        return '/polygon-matic-logo.svg';
      case 'base':
        return '/base-logo.svg';
      default:
        return '/1500x1500.jpeg';
    }
  };

  return (
    <Link href={`/goods/${campaignId}`} passHref>
      <div
        className="relative flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
        onClick={handleCardClick}
      >
        <div className="relative mx-4 -mt-6 h-56 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40">
          <img
            src={imgSrc}
            alt="img-blur-shadow"
            onError={handleError}
            style={{ width: '100%', height: 'auto' }} // Adjust styling as needed
          />
        </div>
        <div className="p-6 flex flex-row justify-between">
          <h5 className=" block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            {campaignName}
          </h5>
          <Image
            src={getProviderImage(providerName)}
            alt={`${providerName} logo`}
            height={15}
            width={15}
          />
        </div>
        <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased ml-6 mb-5">
          {campaignDesc}
        </p>
        <div className="p-6 pt-0">
          <button
            className="select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-light="true"
          >
            Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default GrantCard;
