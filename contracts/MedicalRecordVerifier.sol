// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MedicalRecordVerifier
 * @dev Smart contract for storing and verifying medical records on the blockchain
 */
contract MedicalRecordVerifier {
    address public owner;

    struct Record {
        address doctor;
        string ipfsHash;
        uint timestamp;
    }

    // Mapping from patient address to their records
    mapping(address => Record[]) public patientRecords;

    // Events
    event RecordAdded(address indexed patient, address indexed doctor, string ipfsHash, uint timestamp);
    event RecordVerified(address indexed patient, string ipfsHash, bool isValid);

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Add a new medical record for a patient
     * @param _patient The address of the patient
     * @param _ipfsHash The IPFS hash of the medical record
     */
    function addRecord(address _patient, string memory _ipfsHash) public {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        Record memory newRecord = Record({
            doctor: msg.sender,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        });
        
        patientRecords[_patient].push(newRecord);
        
        // Emit event
        emit RecordAdded(_patient, msg.sender, _ipfsHash, block.timestamp);
    }

    /**
     * @dev Verify if a record exists for a patient
     * @param _patient The address of the patient
     * @param _ipfsHash The IPFS hash to verify
     * @return bool True if the record exists, false otherwise
     */
    function verifyRecord(address _patient, string memory _ipfsHash) public view returns (bool) {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        Record[] memory records = patientRecords[_patient];
        for (uint i = 0; i < records.length; i++) {
            if (keccak256(bytes(records[i].ipfsHash)) == keccak256(bytes(_ipfsHash))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get the number of records for a patient
     * @param _patient The address of the patient
     * @return uint The number of records
     */
    function getRecordCount(address _patient) public view returns (uint) {
        return patientRecords[_patient].length;
    }

    /**
     * @dev Get record details by index
     * @param _patient The address of the patient
     * @param index The index of the record
     * @return doctor The doctor's address who added the record
     * @return ipfsHash The IPFS hash of the record
     * @return timestamp When the record was added
     */
    function getRecordByIndex(address _patient, uint index) public view returns (
        address doctor,
        string memory ipfsHash,
        uint timestamp
    ) {
        require(index < patientRecords[_patient].length, "Record does not exist");
        Record memory record = patientRecords[_patient][index];
        return (record.doctor, record.ipfsHash, record.timestamp);
    }
}
