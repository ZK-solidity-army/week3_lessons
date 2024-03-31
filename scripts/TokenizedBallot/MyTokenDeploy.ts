import {
  abi,
  bytecode,
} from "../../artifacts/contracts/MyToken.sol/MyToken.json";
import { createClient } from "./lib";

async function main() {
  console.log("Deploying...");
  await deployContracts();
}

async function deployContracts() {
  const { deployer, publicClient } = createClient();

  console.log("\nDeploying MyToken contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("MyToken contract deployed to:", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
