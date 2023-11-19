// Import the Hardhat Runtime Environment
const hre = require("hardhat");

async function main() {
    // Define the constructor parameters for the DonationCampaign contract
    const owner = "0xEC6c574E296e5553F7C59f01e122Abc0340f0D4E"; // Replace with the owner address
    const targetAmount = 1000000; // Target amount in Ether (example: 1 ETH)
    const name = "Example Campaign"; // Name of the campaign
    const description = "This is a description of the campaign"; // Description of the campaign
    const imageLink = "http://example.com/image.jpg"; // Link to an image for the campaign
    const endDate = Math.floor(Date.now() / 1000) + 86400; // End date as a Unix timestamp (example: 24 hours from now)
    const campaignID = 1; // An arbitrary campaign ID

    console.log("Deploying DonationCampaign contract...");

    // Deploy the contract
    const donationCampaignFactory = await hre.ethers.getContractFactory(
        "DonationCampaignFactory"
    );
    const donationCampaign = await donationCampaignFactory.deploy();

    console.log(`DonationCampaign deployed to ${donationCampaign.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
