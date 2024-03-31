import { expect } from "chai";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { hexToString, toHex } from "viem";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContractFixture() {
  const publicClient = await viem.getPublicClient();
  const [deployer, otherAccount] = await viem.getWalletClients();
  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  ]);
  return {
    publicClient,
    deployer,
    otherAccount,
    ballotContract,
  };
}

describe("Ballot", () => {
  let ballotContract: any;

  beforeEach(async () => {
    ballotContract = await deployContractFixture();
  });

  describe("when the contract is deployed", async () => {
    it("has the provided proposals", async () => {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const proposal = await ballotContract.read.proposals([BigInt(i)]);
        expect(hexToString(proposal[0], { size: 32 })).to.equal(PROPOSALS[i]);
      }
    });

    it("has zero votes for all proposals", async () => {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const proposal = (await ballotContract.read.proposals([
          BigInt(i),
        ])) as any[];
        expect(proposal[1]).to.equal(0n);
      }
    });

    it("sets the deployer address as chairperson", async () => {
      const { ballotContract, deployer } = await loadFixture(
        deployContractFixture
      );
      const chairperson = await ballotContract.read.chairperson();
      expect(chairperson.toLowerCase()).to.equal(deployer.account.address);
    });

    it("sets the voting weight for the chairperson as 1", async () => {
      const chairperson = await ballotContract.read.chairperson();
      const chairpersonVoter = await ballotContract.read.voters([chairperson]);
      expect(chairpersonVoter[0]).to.eq(1n);
    });
    it("should define the chairperson correctly", async () => {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.equal(ballotContract.deployer.address);
    });
    it("should initialize proposals correctly", async () => {
      const proposalsCount = await ballotContract.proposalsCount();
      expect(proposalsCount).to.equal(3);
    });

    it("should allow a voter to vote for a proposal", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      await ballotContract.vote(0);
      const proposal = await ballotContract.proposals(0);
      expect(proposal.voteCount).to.equal(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("gives right to vote for another address", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      await ballotContract.delegate(ballotContract.acc2.address);
      const voter = await ballotContract.voters(ballotContract.acc1.address);
      expect(voter.delegate).to.equal(ballotContract.acc2.address);
    });
    it("should give right to vote to a voter", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      const voter = await ballotContract.voters(ballotContract.acc1.address);
      expect(voter.weight).to.equal(1);
    });

    it("should not allow a voter to vote again after giving right to vote", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      await expect(
        ballotContract.giveRightToVote(ballotContract.acc1.address)
      ).to.be.rejectedWith("The voter already voted.");
    });

    it("should not allow a voter with weight to vote again", async () => {
      await expect(
        ballotContract.giveRightToVote(ballotContract.acc1.address)
      ).to.be.rejectedWith("The voter already voted.");
    });

    it("should not allow self-delegation", async () => {
      await expect(
        ballotContract.delegate(ballotContract.acc1.address)
      ).to.be.rejectedWith("Self-delegation is disallowed.");
    });

    it("should not allow a loop in delegation", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      await ballotContract.giveRightToVote(ballotContract.acc2.address);
      await ballotContract.delegate(ballotContract.acc2.address);
      await expect(
        ballotContract.delegate(ballotContract.acc1.address)
      ).to.be.rejectedWith("Found loop in delegation.");
    });

    it("should not allow a voter with no weight to vote", async () => {
      await expect(ballotContract.vote(0)).to.be.rejectedWith(
        "Has no right to vote"
      );
    });

    it("should not allow a voter who has voted to vote again", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      await ballotContract.vote(0);
      await expect(ballotContract.vote(0)).to.be.rejectedWith("Already voted.");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {
      // TODO
      throw Error("Not implemented");
    });
  });
  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    it("should return the index of the winning proposal", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      await ballotContract.vote(0);
      const winningProposalIndex = await ballotContract.winningProposal();
      expect(winningProposalIndex).to.equal(0);
    });

    it("should return the name of the winning proposal", async () => {
      await ballotContract.giveRightToVote(ballotContract.acc1.address);
      await ballotContract.vote(0);
      const winnerName = await ballotContract.winnerName();
      const expectedName = "Proposal 1";
      expect(winnerName).to.equal(expectedName);
    });
  });
  describe("when the voter interacts with the vote function in the contract", async () => {
    // TODO
    it("should register the vote", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the voter interacts with the delegate function in the contract", async () => {
    // TODO
    it("should transfer voting power", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the vote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function before any votes are cast", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });
  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});
