import { parseEther, formatEther } from "viem";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { abi } from "../../artifacts/contracts/MyToken.sol/MyToken.json";
import { createClient } from "../lib";

async function main() {
  console.log("Minting...");
  const argv = yargs(hideBin(process.argv))
    .options({
      address: { type: "string", demandOption: true },
      to: { type: "string", demandOption: false },
      amount: { type: "string", demandOption: true },
    })
    .parseSync();

  if (!/^0x[a-fA-F0-9]{40}$/.test(argv.address))
    throw new Error("Invalid contract address --address");

  if (argv.to && !/^0x[a-fA-F0-9]{40}$/.test(argv.to))
    throw new Error("Invalid contract address --to");

  await mint(
    argv.address as `0x${string}`,
    argv.to as `0x${string}`,
    parseEther(argv.amount)
  );
}

async function mint(
  contractAddress: `0x${string}`,
  toAddress: `0x${string}`,
  amount: bigint
) {
  const { deployer, publicClient } = createClient();
  if (!toAddress) {
    toAddress = deployer.account.address;
  }

  console.log(`\nMint ${formatEther(amount)} MTK`);
  console.log("  To address:", toAddress);

  // mint
  const hash = await deployer.writeContract({
    address: contractAddress,
    abi,
    functionName: "mint",
    args: [toAddress, amount],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed");
  console.log(
    `Minted ${formatEther(amount)} decimal units to account ${toAddress}`
  );

  // get balance
  const balance: bigint = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "balanceOf",
    args: [toAddress],
  })) as bigint;
  console.log(
    `Account ${toAddress} has ${formatEther(balance)} decimal units of MyToken`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
