// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationCampaign {
    address public owner;
    uint public targetAmount;
    uint public totalDonations;
    bool public campaignEnded;
    string public name;
    string public description;
    string public imageLink;
    uint public endDate;
    uint public campaignID;

    mapping(address => uint) public donations;

    event DonationReceived(address donor, uint amount);
    event Withdrawal(uint amount, address to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier campaignActive() {
        require(!campaignEnded && block.timestamp <= endDate, "Campaign is not active.");
        _;
    }

    constructor(address _owner, uint _targetAmount, string memory _name, string memory _description, string memory _imageLink, uint _endDate, uint _campaignID) {
        owner = _owner;
        targetAmount = _targetAmount;
        name = _name;
        description = _description;
        imageLink = _imageLink;
        endDate = _endDate;
        campaignEnded = false;
        campaignID = _campaignID;
    }

     // Fallback function to treat direct transfers as donations
    fallback() external payable {
        donate();
    }

    receive() external payable {
        donate();
    }

    function donate() public payable campaignActive {
        require(msg.value > 0, "Donation must be greater than 0.");

        donations[msg.sender] += msg.value;
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);

        if (totalDonations >= targetAmount || block.timestamp > endDate) {
            campaignEnded = true;
        }
    }

    function withdraw(uint _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient funds.");
        require(campaignEnded, "Campaign has not ended yet.");

        payable(owner).transfer(_amount);
        emit Withdrawal(_amount, owner);
    }


}
