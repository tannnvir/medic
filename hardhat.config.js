require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: "",
    },
    localhost: {
      url: "",
      chainId: "",
    },
  },
  paths: {
    artifacts: "./src/artifacts",
    tests: "./test",
    cache: "./cache",
  },
  mocha: {
    timeout: 40000,
  },
};
