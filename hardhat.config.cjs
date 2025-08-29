// hardhat.config.cjs (CommonJS so it works even if "type":"module" is set)
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : [],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : [],
    },
  },
};
