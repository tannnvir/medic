// Contract ABI - Update this with your contract's ABI
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_patient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "addRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "patientRecords",
    "outputs": [
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_patient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "verifyRecord",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract Address - Update this with your deployed contract address
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

let web3;
let contract;
let accounts = [];

// Initialize Web3 and contract
async function init() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected account:", accounts[0]);
      
      // Initialize contract
      contract = new web3.eth.Contract(contractABI, contractAddress);
      
      // Update UI to show connected account
      document.getElementById('account').textContent = `Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
      
      // Hide connect button
      document.getElementById('connectWallet').style.display = 'none';
      
      return true;
    } catch (error) {
      console.error("User denied account access", error);
      showStatus('error', 'Please connect your wallet to continue');
      return false;
    }
  } else {
    console.error("No web3 provider detected. Please install MetaMask!");
    showStatus('error', 'Please install MetaMask to use this dApp!');
    return false;
  }
}

// Upload file to IPFS and add record to blockchain
async function uploadToIPFS() {
  const fileInput = document.getElementById('pdfInput');
  const patientAddress = document.getElementById('patientAddress').value = `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`;
  
  if (!fileInput.files[0]) {
    showStatus('error', 'Please select a PDF file');
    return;
  }
  
  if (!web3.utils.isAddress(patientAddress)) {
    showStatus('error', 'Please enter a valid Ethereum address');
    return;
  }
  
  const button = document.querySelector('button[onclick="uploadToIPFS()"]');
  const originalText = button.textContent;
  
  try {
    // Show loading state
    button.disabled = true;
    button.textContent = "Uploading...";
    
    // Clear previous status
    document.getElementById('uploadStatus').innerHTML = '';
    
    // Here you would typically upload to IPFS
    // For now, we'll simulate an IPFS hash
    const ipfsHash = `QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6u${Math.floor(Math.random() * 1000)}`;
    
    // Show IPFS hash to user in a more visible way
    const ipfsDisplay = document.createElement('div');
    ipfsDisplay.className = 'ipfs-hash';
    ipfsDisplay.innerHTML = `
      <p>IPFS Hash: <strong>${ipfsHash}</strong></p>
      <small>Copy this hash to verify the record later</small>
    `;
    document.getElementById('uploadStatus').appendChild(ipfsDisplay);
    
    // Also show in the status message
    showStatus('info', `Generated IPFS Hash: ${ipfsHash}`);
    
    // Add record to blockchain
    const receipt = await contract.methods.addRecord(patientAddress, ipfsHash)
      .send({ 
        from: accounts[0],
        gas: 300000
      });
    
    console.log("Transaction receipt:", receipt);
    
    // Create a clickable link to view the transaction
    const txLink = `https://localhost:8545/tx/${receipt.transactionHash}`;
    const successMessage = `
      <div class="success-message">
        <p>✅ Record added successfully!</p>
        <p>IPFS Hash: <strong>${ipfsHash}</strong></p>
        <p>Transaction: <a href="#" onclick="window.open('${txLink}', '_blank')">View Transaction</a></p>
      </div>
    `;
    showStatus('success', successMessage);
    
    // Clear the form
    fileInput.value = '';
    document.getElementById('patientAddress').value = '';
    
  } catch (error) {
    console.error("Error:", error);
    showStatus('error', `Error: ${error.message || 'Transaction failed'}`);
  } finally {
    // Reset button state
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

// Verify record on the blockchain
async function verifyRecord() {
  const patientAddress = document.getElementById('verifyAddress').value.trim();
  const cid = document.getElementById('cidInput').value.trim();
  
  if (!web3.utils.isAddress(patientAddress)) {
    showStatus('error', 'Please enter a valid Ethereum address');
    return;
  }
  
  if (!cid) {
    showStatus('error', 'Please enter a CID to verify');
    return;
  }
  
  try {
    const button = document.querySelector('button[onclick="verifyRecord()"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Verifying...";
    
    const isValid = await contract.methods.verifyRecord(patientAddress, cid).call();
    
    if (isValid) {
      showStatus('success', '✅ Record is valid and exists on the blockchain!');
    } else {
      showStatus('info', '❌ Record not found on the blockchain.');
    }
  } catch (error) {
    console.error("Verification error:", error);
    showStatus('error', `Verification failed: ${error.message}`);
  } finally {
    const button = document.querySelector('button[onclick="verifyRecord()"]');
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

// Show status message to user
function showStatus(type, message) {
  const statusDiv = document.getElementById('statusMessage') || document.createElement('div');
  statusDiv.id = 'statusMessage';
  statusDiv.className = `status-message ${type}`;
  statusDiv.innerHTML = message;
  
  // Insert after the container if it doesn't exist
  if (!document.getElementById('statusMessage')) {
    const container = document.querySelector('.container');
    container.parentNode.insertBefore(statusDiv, container.nextSibling);
  }
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    statusDiv.style.opacity = '0';
    setTimeout(() => statusDiv.remove(), 500);
  }, 10000);
}

// Initialize the dApp when the page loads
window.addEventListener('load', async () => {
  const isInitialized = await init();
  if (!isInitialized) {
    document.getElementById('connectWallet').style.display = 'block';
  }
});

// Connect wallet button handler
function connectWallet() {
  init();
}

// Add event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add click handler for connect wallet button
  const connectBtn = document.getElementById('connectWallet');
  if (connectBtn) {
    connectBtn.addEventListener('click', connectWallet);
  }
  
  // Add form submission handlers
  const uploadForm = document.querySelector('.card:first-child');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      uploadToIPFS();
    });
  }
  
  const verifyForm = document.querySelector('.card:last-child');
  if (verifyForm) {
    verifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      verifyRecord();
    });
  }
});
