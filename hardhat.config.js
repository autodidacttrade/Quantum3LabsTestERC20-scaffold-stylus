require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_URL = process.env.API_SEPOLIA_TESTNET_URL + process.env.API_SEPOLIA_TESTNET_KEY;
const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY; // <-- la agregaremos ahora

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
