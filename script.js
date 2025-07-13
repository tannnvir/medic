const contractAddress = "0x59c908fB5562d0813242046cff0FB51a9FC5192f";
const contractABI = [
  {
    inputs: [
      { internalType: "address", name: "_patient", type: "address" },
      { internalType: "string", name: "_ipfsHash", type: "string" },
    ],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_patient", type: "address" },
      { internalType: "string", name: "_ipfsHash", type: "string" },
    ],
    name: "verifyRecord",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

let web3;
let contract;
let account;

// ✅ On Page Load: Connect MetaMask + Contract
window.addEventListener("load", async () => {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    alert("✅ MetaMask Connected:\n" + account);
    contract = new web3.eth.Contract(contractABI, contractAddress);
  } else {
    alert("❌ MetaMask not found. Please install it.");
  }
});

// ✅ Upload PDF to NFT.Storage + Add to Blockchain
async function uploadToIPFS() {
  const fileInput = document.getElementById("pdfInput");
  const patientAddress = document.getElementById("patientAddress").value;

  if (!fileInput.files[0] || !patientAddress) {
    alert("Please select a PDF and enter patient address.");
    return;
  }

  const file = fileInput.files[0];
  const NFT_STORAGE_API_KEY = "8a9ae9a1.d93afc6a4e42495ea26796d70418778d";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("https://api.nft.storage/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer 8a9ae9a1.d93afc6a4e42495ea26796d70418778d",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("NFT.Storage Error:", errorData);
      throw new Error(errorData.error.message || "Failed to upload to IPFS.");
    }

    const data = await response.json();
    const cid = data.value.cid;

    alert("✅ PDF uploaded to IPFS.\nCID: " + cid);

    await contract.methods
      .addRecord(patientAddress, cid)
      .send({ from: account });

    alert("✅ Record added to blockchain successfully!\nCID Stored: " + cid);
  } catch (err) {
    console.error("Detailed Error:", err);
    alert("Error uploading or adding record.\n" + err.message);
  }
}

// ✅ Verify CID from Blockchain
async function verifyRecord() {
  const patient = document.getElementById("verifyAddress").value;
  const cid = document.getElementById("cidInput").value;

  if (!patient || !cid) {
    alert("Enter both patient address and CID.");
    return;
  }

  try {
    const result = await contract.methods.verifyRecord(patient, cid).call();
    document.getElementById("verifyResult").innerText = result
      ? "✅ Record is valid!"
      : "❌ Record not found!";
  } catch (err) {
    console.error(err);
    alert("Verification failed.");
  }
}
