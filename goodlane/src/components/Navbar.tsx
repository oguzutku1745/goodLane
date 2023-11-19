import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between m-10 items-center">
        <div></div>
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
