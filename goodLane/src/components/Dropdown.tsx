import { useState } from "react";
import Image from "next/image";

interface DropdownProps {
    targetChain: string;
    setTargetChain: (chain: string) => void;
  }

export default function Dropdown({ targetChain, setTargetChain }: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleChainSelect = (chain : string) => {
    setTargetChain(chain);
    toggleDropdown();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block text-left">
        <div 
          onClick={toggleDropdown}
          className="cursor-pointer inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        >
          {targetChain || "Select Chain"}
        </div>
        {isDropdownOpen && (
          <div 
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div className="py-2 p-2" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
              <div className="flex rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => handleChainSelect("Optimism")}>
                <Image 
                src="/obt.jpeg"
                alt="Chain logo"
                width={20}
                height={10}
                className="mr-2"
                />
                Optimism
              </div>
              <div className="flex rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => handleChainSelect("Arbitrum")}>
              <Image 
                src="/obt.jpeg"
                alt="Chain logo"
                width={20}
                height={10}
                className="mr-2"
                />
                Arbitrum
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
