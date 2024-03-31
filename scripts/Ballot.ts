import { viem } from "hardhat";
import { toHex } from "viem";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContractFixture() {
  const [deployer] = await viem.getWalletClients();
  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  ]);
  return {
    deployer,
    ballotContract,
  };
}

async function main() {
  const { deployer, ballotContract } = await deployContractFixture();
  console.log(`Ballot contract deployed at ${ballotContract.address}\n`);

  // Give right to vote
  await ballotContract.giveRightToVote(deployer.address);
  console.log(`Right to vote given to ${deployer.address}`);

  // Delegate
  const delegateAddress = "0x...";
  await ballotContract.delegate(delegateAddress);
  console.log(`Delegated vote to ${delegateAddress}`);

  // Vote
  const proposalIndex = 0;
  await ballotContract.vote(proposalIndex);
  console.log(`Voted for proposal ${proposalIndex}`);

  // Get winning proposal
  const winningProposalIndex = await ballotContract.winningProposal();
  console.log(`Winning proposal index: ${winningProposalIndex}`);

  // Get winner name
  const winnerName = await ballotContract.winnerName();
  console.log(`Winner name: ${winnerName}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
