import { hexToString, toHex } from "viem";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { abi } from "../../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { createClient } from "../lib";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      address: { type: "string", demandOption: true },
    })
    .parseSync();

  await getWinner(argv.address as `0x${string}`);
}

async function getWinner(contractAddress: `0x${string}`) {
  const { deployer, publicClient } = createClient();

  console.log("\nGetting winner");
  console.log("  TokenizedBallot address:", contractAddress);
  const winner = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winnerName",
  })) as any;

  const winnerText = hexToString(winner);
  console.log(`  Today's winner is ${winnerText}!`);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
