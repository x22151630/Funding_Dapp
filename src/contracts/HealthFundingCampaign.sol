// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthFundCampaign {
    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint256 goalAmount;
        uint256 raisedAmount;
        bool completed;
        uint256 id;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCounter;

    event CampaignCreated(uint256 indexed id, address indexed creator, string title, uint256 goalAmount);
    event DonationReceived(uint256 indexed id, address indexed donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed id, uint256 amount);
    event CampaignCompleted(uint256 indexed id);

    function createCampaign(string memory _title, string memory _description, uint256 _goalAmount) public {
        campaigns[campaignCounter] = Campaign({
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            goalAmount: _goalAmount,
            raisedAmount: 0,
            completed: false,
            id:campaignCounter
        });

        emit CampaignCreated(campaignCounter, msg.sender, _title, _goalAmount);
        campaignCounter++;
    }

    function donate(uint256 _id) public payable {
        require(_id < campaignCounter, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_id];
        require(!campaign.completed, "Campaign is already completed");
        campaign.raisedAmount += msg.value;

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _id) public {
        require(_id < campaignCounter, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "Only campaign creator can withdraw funds");
        require(campaign.completed, "Campaign is not yet completed");

        uint256 amount = campaign.raisedAmount;
        campaign.raisedAmount = 0;
        campaign.creator.transfer(amount);

        emit FundsWithdrawn(_id, amount);
    }

    function completeCampaign(uint256 _id) public {
        require(_id < campaignCounter, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "Only campaign creator can complete the campaign");
        require(!campaign.completed, "Campaign is already completed");

        campaign.completed = true;
        emit CampaignCompleted(_id);
    }
}