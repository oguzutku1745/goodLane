import { useEffect, useState } from 'react';

import GrantCard from '../components/GrantCard';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setCampaigns(data.campaigns);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">Loading...</div>
    );
  if (error) return <div>Error: {error}</div>;

  console.log(campaigns);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WakuConnection /> abcdef 
      </div>*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaigns &&
          campaigns.map((campaign: any, id: any) => <GrantCard key={id} {...campaign} />)}
      </div>
    </main>
  );
}