import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import {viemConfiguration} from "./configs/viemConfig";
import {connectionConfiguration} from "./configs/rpcConfig";

module.exports = {
    solidity: "0.8.24",
    networks: {
        sepolia: {
            url: `${connectionConfiguration.alchemyBaseUri}/${viemConfiguration.ALCHEMY_API_KEY}`,
            accounts: [viemConfiguration.PRIVATE_KEY],
        },
    },

    
};