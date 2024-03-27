import { expect } from "chai";
import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const TEST_RATIO = 10n;
const TEST_PRICE = 5n;
const TEST_BUY_AMOUNT = "10";
// helpers

async function fixture() {
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2] = await viem.getWalletClients();
  const myTokenContract = await viem.deployContract("MyToken", []);
  const tokenSaleContract = await viem.deployContract("TokenSale", [
    TEST_RATIO,
    TEST_PRICE,
    myTokenContract.address,
    "0x0000000000000000000000000000000000000000",
  ]);
  const MINTER_ROLE = await myTokenContract.read.MINTER_ROLE();
  const giveRoleTx = await myTokenContract.write.grantRole([
    MINTER_ROLE,
    tokenSaleContract.address,
  ]);
  return {
    tokenSaleContract,
    myTokenContract,
    publicClient,
    deployer,
    acc1,
    acc2,
  };
}

describe("NFT Shop", async () => {
  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const [deployer, acc1, acc2] = await viem.getWalletClients();
      const { tokenSaleContract } = await loadFixture(fixture);
      const ratio = await tokenSaleContract.read.ratio();
      expect(ratio).to.equal(TEST_RATIO);
    });
    it("defines the price as provided in parameters", async () => {
      const { tokenSaleContract } = await loadFixture(fixture);
      const price = await tokenSaleContract.read.price();
      expect(price).to.equal(TEST_PRICE);
    });
    it("uses a valid ERC20 as payment token", async () => {
      const { tokenSaleContract } = await loadFixture(fixture);
      const paymentTokenAddress = await tokenSaleContract.read.paymentToken();
      const paymentToken = await viem.getContractAt(
        "IERC20",
        paymentTokenAddress
      );
      await expect(paymentToken.read.totalSupply()).to.not.be.rejected;
    });
    it("uses a valid ERC721 as NFT collection", async () => {
      const { tokenSaleContract, myTokenContract, acc1 } = await loadFixture(
        fixture
      );
      const paymentTokenAddress = await tokenSaleContract.read.paymentToken();
      const tx = await tokenSaleContract.write.buyTokens({
        value: parseEther(TEST_BUY_AMOUNT),
      });
      const tokenBalance = await myTokenContract.read.balanceOf([
        acc1.account.address,
      ]);
    });
  });
  describe("When a user buys an ERC20 from the Token contract", async () => {
    it("charges the correct amount of ETH", async () => {
      const {
        publicClient,
        tokenSaleContract,
        myTokenContract,
        deployer,
        acc1,
      } = await loadFixture(fixture);
      const ethBalanceBefore = await publicClient.getBalance({
        address: acc1.account.address,
      });
      const tx = await tokenSaleContract.write.buyTokens({
        value: parseEther(TEST_BUY_AMOUNT),
        account: acc1.account,
      });
      const txReceipt = await publicClient.getTransactionReceipt({ hash: tx });
      const gasAmount = await txReceipt.gasUsed;
      const gasPrice = txReceipt.effectiveGasPrice;
      const txFees = gasAmount * gasPrice;
      const ethBalanceAfter = await publicClient.getBalance({
        address: acc1.account.address,
      });
      const diff = ethBalanceBefore - ethBalanceAfter;
      expect(diff).to.be.eq(parseEther(TEST_BUY_AMOUNT) + txFees);
    });
    it("gives the correct amount of tokens", async () => {
      const { tokenSaleContract, myTokenContract, deployer, acc1 } =
        await loadFixture(fixture);
      const tokenBalanceBefore = await myTokenContract.read.balanceOf([
        acc1.account.address,
      ]);
      const tx = await tokenSaleContract.write.buyTokens({
        value: parseEther(TEST_BUY_AMOUNT),
        account: acc1.account,
      });
      const tokenBalanceAfter = await myTokenContract.read.balanceOf([
        acc1.account.address,
      ]);
      const diff = tokenBalanceAfter - tokenBalanceBefore;
      expect(diff).to.be.eq(parseEther(TEST_BUY_AMOUNT) * TEST_RATIO);
    });
  });
  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      // step 1 -> call the tokenContract to approve amount to the tokensaleCtonract
      // step 2 -> call the TokenSaleCtonract for returnTokens function
      // step 3 -> Check the ETH balance of the user.
      throw new Error("Not implemented");
    });
    it("burns the correct amount of tokens", async () => {
      // step 1 -> call the tokenContract to approve amount to the tokensaleCtonract
      // step 2 -> call the TokenSaleCtonract for returnTokens function
      // step 3 -> Check the TOKEN balance of the user.
      throw new Error("Not implemented");
    });
  });
  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  });
  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
  });
  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});
