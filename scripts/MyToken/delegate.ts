import { parseEther, formatEther } from "viem";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { abi } from "../../artifacts/contracts/MyToken.sol/MyToken.json";
import { createClient } from "../lib";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      address: { type: "string", demandOption: true },
      to: { type: "string", demandOption: false },
    })
    .parseSync();

  if (!/^0x[a-fA-F0-9]{40}$/.test(argv.address))
    throw new Error("Invalid contract address --address");

  if (argv.to && !/^0x[a-fA-F0-9]{40}$/.test(argv.to))
    throw new Error("Invalid contract address --to");

  await delegate(argv.address as `0x${string}`, argv.to as `0x${string}`);
}

async function delegate(
  contractAddress: `0x${string}`,
  toAddress: `0x${string}`
) {
  const { deployer, publicClient } = createClient();
  if (!toAddress) {
    toAddress = deployer.account.address;
  }

  console.log("\nDelegate vote power");
  console.log("  From address:", deployer.account.address);
  console.log("  To address:", toAddress);

  // get voting power
  const votingPower: bigint = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getVotes",
    args: [toAddress],
  })) as bigint;
  console.log(
    `BEFORE: Account ${toAddress} has ${formatEther(
      votingPower
    )} units of voting power`
  );

  // delegate
  const hash = await deployer.writeContract({
    address: contractAddress,
    abi,
    functionName: "delegate",
    args: [toAddress],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed");
  console.log("  Block number: ", receipt.blockNumber);

  // get balance
  const votingPowerAfter: bigint = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getVotes",
    args: [toAddress],
  })) as bigint;
  console.log(
    `NOW: Account ${toAddress} has ${formatEther(
      votingPowerAfter
    )} units of voting power`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
