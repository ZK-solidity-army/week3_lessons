import * as dotenv from "dotenv";
dotenv.config();

export const viemConfiguration = {
    PRIVATE_KEY: process.env.PRIVATE_KEY || "",
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || "",
};