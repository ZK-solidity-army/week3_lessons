import {viem} from "hardhat";

async function main() {
    const publicClient = await viem.getPublicClient();
    // const publicClient = createPublicClient({
    //     chain: sepolia,
    //     transport: http(`${connectionConfiguration.alchemyBaseUri}/${viemConfiguration.ALCHEMY_API_KEY}`),
    // });
    const [deployer, account1, account2] = await viem.getWalletClients();
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});