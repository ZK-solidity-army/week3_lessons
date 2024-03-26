export interface ConnectionConfiguration {
    alchemyBaseUri: string;
}

const ALCHEMY_BASE_URI = `https://eth-sepolia.g.alchemy.com/v2`

export const connectionConfiguration: ConnectionConfiguration = {
    alchemyBaseUri: ALCHEMY_BASE_URI,
}


