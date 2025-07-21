import { useState } from "react";
import { contractABI, contractAddress } from "./abi";
import { ethers } from "ethers";

function App() {
  const [text, setText] = useState("");
  const [getMessage, setGetMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const tx = await contract.setMessage(text);
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
        alert(
          `Message set successfully with transaction hash: ${txReceipt.hash}`
        );
      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error);
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const message = await contract.getMessage();
        setGetMessage(message);
      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error getting message:", error);
      alert(error);
    }
  }

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Set Message on Smart Contract</h1>
        <input
          type="text"
          placeholder="Set message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSet}>Set Message</button>
      </div>

      <div style={{ padding: "2rem" }}>
        <h1>Get Message from Smart Contract</h1>
        <button onClick={handleGet}>Get Message</button>
        <div>Current message: {getMessage}</div>
      </div>
    </>
  );
}

export default App;
