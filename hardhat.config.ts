import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: false,
        interval: 12000,
        mempool: {
          order: "fifo",
        },
      },
    },
  },
  solidity: "0.8.24",
};

export default config;
