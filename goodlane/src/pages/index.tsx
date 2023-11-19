// import * as circomlib from 'circomlib';
// import * as circomlibjs from 'circomlibjs';
import { ethers } from 'ethers';
import merkleTree from 'fixed-merkle-tree';
import { useEffect, useState } from 'react';

// import
import { factoryAbi } from '../abis/factoryAbi';
import GrantCard from '../components/GrantCard';
import { genProofArgs, pedersenHash } from '../utils/circuit';

// import { pedersenHash } from '../utils/pedersen';

const provider = new ethers.providers.JsonRpcProvider(
  'https://goerli.infura.io/v3/774dc13131de491b93419ad07613b6c4',
);
const factoryContract = new ethers.Contract(
  '0xCd4e5e4028A14f75FBa499905dFf120AeF6d91EA',
  factoryAbi,
  provider,
);

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

  function toBigIntLE(buf) {
    const reversed = Buffer.from(buf);
    reversed.reverse();
    const hex = reversed.toString('hex');
    if (hex.length === 0) {
      return BigInt(0);
    }
    return BigInt(`0x${hex}`);
  }

  // console.log('ci', circomlib!, circomlibjs);

  async function generateMerkleProof(deposit) {
    console.log('Getting contract state...');
    const events = await factoryContract.getPastEvents('Deposit', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    const leaves = events
      .sort((a, b) => a.returnValues.leafIndex - b.returnValues.leafIndex) // Sort events in chronological order
      .map((e) => e.returnValues.commitment);
    const tree = new merkleTree(20, leaves);

    // Find current commitment in the tree
    let depositEvent = events.find((e) => e.returnValues.commitment === toHex(deposit.commitment));
    let leafIndex = depositEvent ? depositEvent.returnValues.leafIndex : -1;

    // Validate that our data is correct (optional)
    // const isValidRoot = await contract.methods.isKnownRoot(toHex(tree.root())).call();
    // const isSpent = await contract.methods.isSpent(toHex(deposit.nullifierHash)).call();
    // assert(isValidRoot === true, 'Merkle tree is corrupted');
    // assert(isSpent === false, 'The note is already spent');
    // assert(leafIndex >= 0, 'The deposit is not found in the tree');

    // Compute merkle proof of our commitment
    const { pathElements, pathIndices } = tree.path(leafIndex);
    return { pathElements, pathIndices, root: tree.root };
  }

  function createDeposit(nullifier, secret) {
    let deposit = { nullifier, secret, preimage: null, commitment: null, nullifierHash: null };
    //@ts-ignore
    // deposit.preimage = Buffer.concat([toBigIntLE(31), toBigIntLE(31)]);
    deposit.commitment = pedersenHash(deposit.preimage);
    console.log('deposit', deposit);
    const merk = generateMerkleProof(deposit);
    console.log('🚀 ~ file: index.tsx:97 ~ createDeposit ~ merk:', merk);

    // deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
    return deposit;
  }

  const toHex = (number, length = 32) =>
    '0x' +
    (number instanceof Buffer ? number.toString('hex') : BigInt(number).toString(16)).padStart(
      length * 2,
      '0',
    );

  /**
   * Make an ETH deposit
   */
  async function deposit() {
    const deposit = createDeposit(BigInt(31), BigInt(31));
    console.log('Sending deposit transaction...');
    // const tx = await contract.methods
    //   .deposit(toHex(deposit.commitment))
    //   .send({ value: toWei(AMOUNT), from: web3.eth.defaultAccount, gas: 2e6 })
    // console.log(`https://kovan.etherscan.io/tx/${tx.transactionHash}`)
    return `tornado-eth-${1}-${0}-${toHex(deposit.preimage, 62)}`;
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WakuConnection /> abcdef 
      </div>*/}
      {/* <button onClick={async () => await deposit()}>Create proof</button> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {campaigns &&
          campaigns.map((campaign: any, id: any) => <GrantCard key={id} {...campaign} />)}
      </div>
    </main>
  );
}
