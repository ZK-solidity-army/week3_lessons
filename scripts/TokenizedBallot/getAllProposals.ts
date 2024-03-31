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

  await getAllProposals(argv.address as `0x${string}`);
}

async function getAllProposals(contractAddress: `0x${string}`) {
  const { deployer, publicClient } = createClient();

  console.log("\nGetting all proposals");
  console.log("  TokenizedBallot address:", contractAddress);
  const proposals = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getAllProposals",
  })) as any[];

  console.log("Found proposals:");
  for (let i = 0; i < proposals.length; i++) {
    const proposal = proposals[i];
    const name = hexToString(proposal.name, { size: 32 });
    const votes = proposal.voteCount;
    console.log(`  ${i + 1}. ${name}: ${votes} votes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
