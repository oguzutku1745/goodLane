// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DonationCampaign.sol";

contract DonationCampaignFactory {
    DonationCampaign[] public deployedCampaigns;

    // State variable for tracking campaign IDs
    uint public _campaignIDCounter;

    event CampaignCreated(address campaignAddress, address owner, uint targetAmount, string name, string description, string imageLink, uint endDate, uint campaignID);

    constructor() {
        _campaignIDCounter = 0; // Initialize the counter
    }

    function createDonationCampaign(uint _targetAmount, string memory _name, string memory _description, string memory _imageLink, uint _endDate) public returns (address) {
        // Use the current value of _campaignIDCounter as the campaign ID
        uint currentCampaignID = _campaignIDCounter;

        DonationCampaign newCampaign = new DonationCampaign(msg.sender, _targetAmount, _name, _description, _imageLink, _endDate, currentCampaignID);
        deployedCampaigns.push(newCampaign);

        // Emit the event with the current campaign ID
        emit CampaignCreated(address(newCampaign), msg.sender, _targetAmount, _name, _description, _imageLink, _endDate, currentCampaignID);

        // Increment the counter for the next campaign
        _campaignIDCounter++;

        return address(newCampaign);
    }
}
