import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between m-10 items-center">
        <div>
          <Image
            src="/goodLane_p.svg"
            alt="Logo GoodLane"
            width={75}
            height={75}
            className="ml-5 mt-3"
          />
        </div>
        <div className="flex ml-5 gap-x-20">
          <Link className="text-" href="/">
            Homepage
          </Link>
          <Link href="/create">Create Good</Link>
        </div>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
