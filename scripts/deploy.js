const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MedicalRecordVerifier contract...");
  
  // Get the contract factory
  const MedicalRecordVerifier = await hre.ethers.getContractFactory("MedicalRecordVerifier");
  
  // Deploy the contract
  const medicalRecordVerifier = await MedicalRecordVerifier.deploy();
  
  // Wait for the deployment to complete
  await medicalRecordVerifier.deployed();
  
  console.log("✅ MedicalRecordVerifier deployed to:", medicalRecordVerifier.address);
  
  return medicalRecordVerifier.address;
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
