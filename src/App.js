import React, { useEffect, useState, createContext } from "react";
import Web3 from "web3";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Navbar";
import Routes from "./Routes";
import Abi from "./HealthFundingCampaign.json";
export const HealthFundingCampaign =
  "0xCFA5a33C6B6707FA1Ed8ae3031b41C2c9C752098";

export const GlobalContext = createContext();
function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState("");
  const [userBalance, setUserBalance] = useState("");
  const [healthInstance, setHealthInstance] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  const connectWallet = async () => {
    console.log("connect Wallet");
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accs = await web3Instance.eth.getAccounts();
        setAccounts(accs);
        setCurrentAccount(accs[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  const disconnectWallet = async () => {
    setWeb3(null);
    setCurrentAccount("");
    setAccounts([]);
  };

  useEffect(() => {
    (async function () {
      if (web3) {
        const response = await new web3.eth.Contract(
          Abi,
          HealthFundingCampaign
        );
        setHealthInstance(response);
      }
    })();
  }, [web3]);

  useEffect(() => {
    (async function () {
      try {
        if (web3 && currentAccount && healthInstance) {
          const response = await healthInstance.methods
            .campaignCounter()
            .call({ from: currentAccount });
          console.log(Number(response));
          let _campaigns = [];
          for (let i = 0; i < Number(response); i++) {
            const _campaign = await healthInstance.methods.campaigns(i).call();
            _campaigns.push(_campaign);
          }
          setCampaigns(_campaigns);
          console.log(_campaigns);
        }
      } catch (err) {
        console.log(err);
        setError(err?.message);
      }
    })();
  }, [currentAccount, healthInstance, web3]);
  useEffect(() => {
    const handleAccountsChanged = () => {
      connectWallet();
    };
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    connectWallet();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        web3,
        currentAccount,
        setError,
        healthInstance,
        userBalance,
        campaigns,
        setUserBalance,
      }}
    >
      <>
        <Navbar
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />

        <br />
        <span style={{ fontSize: "18px", color: "red" }}>{error}</span>
        <Routes />
      </>
    </GlobalContext.Provider>
  );
}

export default App;
