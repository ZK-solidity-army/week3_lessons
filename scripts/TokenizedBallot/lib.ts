import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

import { PRIVATE_KEY, ALCHEMY_URL } from "../../config";
import { createPublicClient, createWalletClient, http } from "viem";

export function createClient() {
  const account = privateKeyToAccount(PRIVATE_KEY);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(ALCHEMY_URL),
  });
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(ALCHEMY_URL),
  });

  return { account, deployer, publicClient };
}
