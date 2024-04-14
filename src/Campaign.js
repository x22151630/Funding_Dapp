import React, { useContext, useState } from "react";
import { GlobalContext } from "./App";

const Campaign = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const { web3, setError, currentAccount, healthInstance } =
    useContext(GlobalContext);
  const buttonStyle = {
    padding: "10px",
    margin: "5px",
    cursor: "pointer",
    width: "150px",
  };
  const inputStyle = {
    padding: "10px",
    margin: "10px",
    width: "300px",
  };

  const create = async () => {
    try {
      if (web3 && currentAccount && healthInstance) {
        const response = await healthInstance.methods
          .createCampaign(title, description, goalAmount)
          .send({ from: currentAccount });
        console.log(response);
      }
    } catch (err) {
      console.log(err);
      setError(err?.message);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span>Create Campaign</span>
        <input
          style={inputStyle}
          placeholder="enter title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="enter description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="enter amount in ETH"
          onChange={(e) =>
            setGoalAmount(web3?.utils?.toWei(e.target.value, "ether"))
          }
        />
        <button style={buttonStyle} onClick={create}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Campaign;
