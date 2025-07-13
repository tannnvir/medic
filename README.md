# Medical Records DApp

A decentralized application for managing medical records on the Ethereum blockchain using IPFS for file storage.

## Features

- Store medical records on IPFS
- Record IPFS hashes on the Ethereum blockchain
- Verify record authenticity
- View record history
- Secure and transparent

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Hardhat

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd medic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Testing

Run the test suite:

```bash
npm test
```

This will:
1. Compile the smart contracts
2. Start a local Hardhat Network
3. Run all the tests

## Local Development

1. Start a local Hardhat node:
   ```bash
   npx hardhat node
   ```

2. In a new terminal, deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

## Smart Contract

The `MedicalRecordVerifier` smart contract provides the following functions:

- `addRecord(address _patient, string memory _ipfsHash)`: Add a new medical record
- `verifyRecord(address _patient, string memory _ipfsHash)`: Verify if a record exists
- `getRecordCount(address _patient)`: Get the number of records for a patient
- `getRecordByIndex(address _patient, uint index)`: Get record details by index

## Project Structure

- `/contracts`: Solidity smart contracts
- `/scripts`: Deployment scripts
- `/test`: Test files
- `/src`: Frontend source code (to be added)

## License

MIT