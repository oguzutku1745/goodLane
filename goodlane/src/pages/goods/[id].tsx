import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { TransferTokenCard } from '../../features/transfer/TransferTokenCard';

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

function GoodDetailsPage() {
  const [campaign, setCampaign] = useState<GrantProps | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [proof, setProof] = useState('');
  const { address } = useAccount();
  useEffect(() => {
    const storedCampaign = localStorage.getItem('selectedCampaign');
    if (storedCampaign) {
      setCampaign(JSON.parse(storedCampaign));
      setImgSrc(JSON.parse(storedCampaign).campaignImage);
      console.log(JSON.parse(storedCampaign));
      localStorage.removeItem('selectedCampaign');
    }
  }, []);

  console.log(campaign);

  const handleError = () => {
    setImgSrc('/broken-image.jpg');
  };

  const date = new Date(Number(campaign?.campaignDeadline) * 1000);

  console.log(campaign?.campaignDeadline);

  console.log(date);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProof(e.target.value);
  };

  const claimDonation = async () => {
    try {
    } catch (error) {}
  };

  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  if (!campaign) return <div>Loading...</div>;

  return (
    <>
      {campaign && campaign.campaignOwner == address ? (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="relative block p-8 overflow-hidden border w-1/2 h-[60vh] bg-white border-slate-100 rounded-lg ml-6 mr-6">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex flex-col gap-8 items-center justify-center mb-5">
              {/* <img
                  src={imgSrc}
                  alt="img-blur-shadow"
                  onError={handleError}
                  style={{ width: '50%', height: '10%' }}
                /> */}
              <h1 className="text-3xl tracking-tighter font-semibold">Claim Donation</h1>
              <input
                className="w-full py-2 px-2 border "
                placeholder="Place donation proof here"
                onChange={(e) => handleChange(e)}
                type="text"
                value={proof}
              />
              <button
                onClick={claimDonation}
                className="px-6 py-2 border hover:bg-blue-400 hover:text-white rounded-md transition duration-200 ease-in-out text-xl"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex min-h-screen flex-col items-center justify-between p-24`}>
          <a className="relative block p-8 overflow-hidden border bg-white border-slate-100 rounded-lg ml-6 mr-6">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="flex items-center justify-center mb-5">
              <img
                src={imgSrc}
                alt="img-blur-shadow"
                onError={handleError}
                style={{ width: '50%', height: '10%' }} // Adjust styling as needed
              />
            </div>
            <div className="justify-between sm:flex">
              <div>
                <h5 className="text-xl font-bold text-slate-900">{campaign?.campaignName}</h5>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  By {campaign.campaignOwner}
                </p>
              </div>

              <div className="flex-shrink-0 hidden ml-3 sm:block"></div>
            </div>

            <div className="mt-4 sm:pr-8">
              <p className="text-sm text-slate-500">{campaign?.campaignDesc}</p>
            </div>

            <dl className="flex flex-col mt-6 gap-y-2">
              <div className="flex flex-col-reverse">
                <dt className="text-sm font-medium text-slate-600">
                  {campaign.campaignEnded ? 'Active' : 'Passive'}
                </dt>
                <dd className="text-xs text-slate-500">{`${formattedDate}, Time: ${formattedTime}`}</dd>
              </div>

              <div className="flex flex-col-reverse ml-3 sm:ml-6">
                <dt className="text-sm font-medium text-slate-600">Target Amount</dt>
                <dd className="text-xs text-slate-500">{campaign.campaignAmount}</dd>
              </div>

              <TransferTokenCard address={campaign.address} />
            </dl>
          </a>
        </div>
      )}
    </>
  );
}

export default GoodDetailsPage;
