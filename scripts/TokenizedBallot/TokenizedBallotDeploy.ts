import { toHex } from "viem";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  abi,
  bytecode,
} from "../../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { createClient } from "./lib";

async function main() {
  console.log("Deploying...");
  const argv = yargs(hideBin(process.argv))
    .options({
      address: { type: "string", demandOption: true },
      block: { type: "number", demandOption: true },
      proposals: { type: "string", demandOption: true },
    })
    .parseSync();

  if (!argv.address) {
    throw new Error("MyToken address not provided");
  }
  if (!argv.block) {
    throw new Error("Block number not provided");
  }
  if (!argv.proposals) {
    throw new Error("Proposals not provided");
  }

  await deployContracts(
    argv.address as `0x${string}`,
    argv.block,
    argv.proposals.split(",")
  );
}

async function deployContracts(
  tokenAddress: `0x${string}`,
  blockNumber: number,
  proposals: string[]
) {
  const { deployer, publicClient } = createClient();

  console.log("\nDeploying TokenizedBallotToken contract");
  console.log("  Token address:", tokenAddress);
  console.log("  Block number:", blockNumber);
  console.log("  Proposals:", proposals);
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [
      proposals.map((prop) => toHex(prop, { size: 32 })),
      tokenAddress,
      BigInt(blockNumber),
    ],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(
    "TokenizedBallotToken contract deployed to:",
    receipt.contractAddress
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
