import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./App";
import { getEthBalance } from "./eth-service";

const Navbar = ({ connectWallet, disconnectWallet }) => {
  const navigate = useNavigate();
  const { currentAccount, web3, setError, setUserBalance, userBalance } =
    useContext(GlobalContext);

  useEffect(() => {
    (async function () {
      if (web3 && currentAccount) {
        const _balance = await getEthBalance(currentAccount);
        console.log(_balance);
        setUserBalance(web3?.utils?.fromWei(_balance, "ether"));
      }
    })();
  }, [currentAccount, web3]);

  return (
    <div
      style={{
        backgroundColor: "#1B2534",
        height: "50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <div
        onClick={() => navigate("/")}
        style={{ color: "white", fontSize: "20px", cursor: "pointer" }}
      >
        Health Funding Crowd Sourcing
      </div>
      <span style={{ color: "white", fontSize: "18px", cursor: "pointer" }}>
        Account Balance: {userBalance} ETH
      </span>
      <span
        onClick={() => navigate("/create-campaign")}
        style={{ color: "white", fontSize: "18px", cursor: "pointer" }}
      >
        Create Campaign
      </span>

      {currentAccount && (
        <span
          style={{ color: "white", fontSize: "18px", cursor: "pointer" }}
          onClick={() => disconnectWallet()}
        >
          {currentAccount}
        </span>
      )}
      {!currentAccount && (
        <button
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "1px solid white",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Navbar;
