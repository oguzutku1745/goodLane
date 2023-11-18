import { useState } from 'react';
import Dropdown from '@/components/Dropdown';
import DatePicker from '@/components/DatePicker';
import { useContractWrite } from 'wagmi';

export default function Create() {
    const [grantDetails, setGrantDetails] = useState({
        name: "",
        desc: "",
        banner: "",
        chain: "",
        targetNumber: 0,
        date: new Date(),
    });

    console.log(grantDetails)

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setGrantDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form className="w-full max-w-lg">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="project-name">
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
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="banner-link">
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
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
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
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="banner-link">
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
                        <DatePicker endDate={grantDetails.date} setEndDate={(date) => setGrantDetails(prev => ({ ...prev, date }))}  />
                    </div>    
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <Dropdown targetChain={grantDetails.chain} setTargetChain={(chain) => setGrantDetails(prev => ({ ...prev, chain }))} />
                    </div>  
                </div>
                <div className="md:flex md:items-center">
                    <div className="md:w-1/3">
                        <button className="shadow bg-teal-400 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                            Post
                        </button>
                    </div>
                    <div className="md:w-2/3"></div>
                </div>
            </form>
        </main>
    );
}
