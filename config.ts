import * as dotenv from "dotenv";
dotenv.config();

export const PRIVATE_KEY = (`0x${process.env.PRIVATE_KEY}` ||
  "") as `0x${string}`;
export const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY || "";
export const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${
  process.env.ALCHEMY_API_KEY || ""
}`;
