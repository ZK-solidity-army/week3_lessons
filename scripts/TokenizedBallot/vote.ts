import { toHex, parseEther, formatEther, createPublicClient } from "viem";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { abi } from "../../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { createClient } from "../lib";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      address: { type: "string", demandOption: true },
      proposal: { type: "string", demandOption: true },
      amount: { type: "string", demandOption: true },
    })
    .parseSync();

  if (!argv.address) {
    throw new Error("Contract address is not provided");
  }
  if (!argv.proposal) {
    throw new Error("Proposal is not provided");
  }
  if (!argv.amount) {
    throw new Error("Provide vote amount");
  }

  await vote(
    argv.address as `0x${string}`,
    argv.proposal,
    parseEther(argv.amount)
  );
}

async function vote(
  contractAddress: `0x${string}`,
  proposal: string,
  amount: bigint
) {
  const { deployer, publicClient } = createClient();

  console.log(`\nVote for ${proposal}`);
  console.log("  Amount:", amount, ` (${formatEther(amount)} decimal units)`);
  console.log("  TokenizedBallot address:", contractAddress);

  const proposalIndex = await getProposalIndex(
    publicClient,
    contractAddress,
    proposal
  );
  console.log("Found proposal index:", proposalIndex);

  console.log(`Voting to proposal "${proposal}"`);
  console.log("Confirm? (Y/n)");

  const stdin = process.openStdin();
  stdin.addListener("data", async (d) => {
    if (d.toString().trim().toLowerCase() == "n") {
      console.log("Operation cancelled");
      process.exit(1);
    }

    console.log("Sending transaction...");
    const hash = await deployer.writeContract({
      address: contractAddress,
      abi,
      functionName: "vote",
      // skip GasEstimation step because of the following error:
      //   version: 'viem@1.21.3',
      //   cause: EstimateGasExecutionError: Execution reverted for an unknown reason.
      // https://github.com/wevm/viem/discussions/732
      // gas: 1000000n,
      args: [BigInt(proposalIndex), amount],
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status == "reverted") {
      throw new Error("Transaction reverted");
    }
    console.log("Transaction confirmed");
    process.exit();
  });
}

async function getProposalIndex(
  publicClient: ReturnType<typeof createPublicClient>,
  contractAddress: `0x${string}`,
  proposal: string
) {
  const proposals = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getAllProposals",
  })) as any[];

  for (let i = 0; i < proposals.length; i++) {
    if (proposals[i].name === toHex(proposal, { size: 32 })) {
      return i;
    }
  }

  throw new Error(`Proposal "${proposal}" not found`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
