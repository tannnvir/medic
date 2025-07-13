const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecordVerifier", function () {
  let MedicalRecordVerifier;
  let medicalRecordVerifier;
  let owner, doctor, patient;
  const testIPFSHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

  beforeEach(async function () {
    // Get signers
    [owner, doctor, patient] = await ethers.getSigners();

    // Deploy the contract
    MedicalRecordVerifier = await ethers.getContractFactory("MedicalRecordVerifier");
    medicalRecordVerifier = await MedicalRecordVerifier.deploy();
    await medicalRecordVerifier.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await medicalRecordVerifier.owner()).to.equal(owner.address);
    });
  });

  describe("addRecord", function () {
    it("Should add a new record", async function () {
      await expect(
        medicalRecordVerifier.connect(doctor).addRecord(patient.address, testIPFSHash)
      )
        .to.emit(medicalRecordVerifier, "RecordAdded")
        .withArgs(patient.address, doctor.address, testIPFSHash);

      // Verify the record was added
      const recordCount = await medicalRecordVerifier.getRecordCount(patient.address);
      expect(recordCount).to.equal(1);

      // Get the record details
      const [doc, ipfsHash, timestamp] = await medicalRecordVerifier.getRecordByIndex(patient.address, 0);
      expect(doc).to.equal(doctor.address);
      expect(ipfsHash).to.equal(testIPFSHash);
      expect(timestamp).to.be.a("bigint");
    });

    it("Should revert with zero address", async function () {
      await expect(
        medicalRecordVerifier.addRecord(ethers.constants.AddressZero, testIPFSHash)
      ).to.be.revertedWith("Invalid patient address");
    });

    it("Should revert with empty IPFS hash", async function () {
      await expect(
        medicalRecordVerifier.addRecord(patient.address, "")
      ).to.be.revertedWith("IPFS hash cannot be empty");
    });
  });

  describe("verifyRecord", function () {
    beforeEach(async function () {
      // Add a record first
      await medicalRecordVerifier.connect(doctor).addRecord(patient.address, testIPFSHash);
    });

    it("Should verify an existing record", async function () {
      const isValid = await medicalRecordVerifier.verifyRecord(patient.address, testIPFSHash);
      expect(isValid).to.be.true;
    });

    it("Should not verify non-existent record", async function () {
      const isValid = await medicalRecordVerifier.verifyRecord(patient.address, "nonexistent-hash");
      expect(isValid).to.be.false;
    });

    it("Should revert with zero address", async function () {
      await expect(
        medicalRecordVerifier.verifyRecord(ethers.constants.AddressZero, testIPFSHash)
      ).to.be.revertedWith("Invalid patient address");
    });
  });

  describe("getRecordCount", function () {
    it("Should return 0 for new patient", async function () {
      const count = await medicalRecordVerifier.getRecordCount(patient.address);
      expect(count).to.equal(0);
    });

    it("Should return correct count after adding records", async function () {
      await medicalRecordVerifier.connect(doctor).addRecord(patient.address, testIPFSHash);
      await medicalRecordVerifier.connect(doctor).addRecord(patient.address, testIPFSHash + "1");
      
      const count = await medicalRecordVerifier.getRecordCount(patient.address);
      expect(count).to.equal(2);
    });
  });
});
