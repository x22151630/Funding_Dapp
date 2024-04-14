import React, { useContext, useState } from "react";
import { GlobalContext } from "./App";

const Home = () => {
  const { campaigns, web3, setError, healthInstance, currentAccount } =
    useContext(GlobalContext);
  const [donateAmount, setDonateAmount] = useState("");
  const buttonStyle = {
    padding: "5px",

    cursor: "pointer",
    width: "200px",
  };
  const inputStyle = {
    padding: "7px",
    width: "200px",
    margin: "5px 0px",
  };
  const rowStyle = {
    margin: "5px 0px",
  };
  const donate = async (id) => {
    try {
      if (web3 && currentAccount && healthInstance) {
        const response = await healthInstance.methods
          .donate(id)
          .send({ from: currentAccount, value: donateAmount });
        console.log(response);
      }
    } catch (err) {
      console.log(err);
      setError(err?.message);
    }
  };
  const claim = async (id) => {
    try {
      if (web3 && currentAccount && healthInstance) {
        await healthInstance.methods
          .completeCampaign(id)
          .send({ from: currentAccount });
        await healthInstance.methods
          .withdrawFunds(id)
          .send({ from: currentAccount });
      }
    } catch (err) {
      setError(err?.message);
      console.log(err);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        margin: "10px",
      }}
    >
      {campaigns.map((campaign) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid #1B2534",
            padding: "10px",
            margin: "10px",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              ...rowStyle,
              color: campaign?.completed ? "red" : "green",
            }}
          >
            {campaign?.completed ? "Closed" : "Active"}
          </div>
          <div style={rowStyle}>Title: {campaign.title}</div>
          <div style={rowStyle}>Description {campaign.description}</div>
          <div style={rowStyle}>
            Goal Amount:- {web3?.utils?.fromWei(campaign.goalAmount, "ether")}{" "}
            ETH
          </div>
          <div style={rowStyle}>
            Raised Amount:-{" "}
            {web3?.utils?.fromWei(campaign.raisedAmount, "ether")} ETH
          </div>

          {currentAccount === campaign.creator && !campaign?.completed && (
            <button style={buttonStyle} onClick={() => claim(campaign.id)}>
              Close & Claim Donations
            </button>
          )}

          {currentAccount !== campaign.creator && !campaign?.completed && (
            <>
              <input
                style={inputStyle}
                placeholder="enter amount to donation"
                onChange={(e) =>
                  setDonateAmount(web3?.utils?.toWei(e.target.value, "ether"))
                }
              />
              <button
                style={buttonStyle}
                onClick={() => donate(Number(campaign.id))}
              >
                Donate
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
