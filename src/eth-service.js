export const getEthBalance = async (address) => {
  const apiKey = "U6FQ92XWB7PMKSBGTJ2S2F2Y7VFSG4HAH5";
  const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data.status === "1") {
      return data.result;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error fetching Ethereum balance:", error);
    return null;
  }
};
