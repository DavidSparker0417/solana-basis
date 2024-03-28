import { Cluster, Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

export function SOL_IsValidWalletAddress(address: String): boolean {
    try {
        // The PublicKey constructor will throw an error if the address is not a valid Solana public key
        new PublicKey(address);
        return true;
    } catch (error) {
        // If an error is thrown, the address is not a valid Solana public key
        return false;
    }
}

export async function SOL_QueryBalance(_address: String, net: Cluster = 'devnet') {
    const connection = new Connection(clusterApiUrl(net));
    const address = new PublicKey(_address);
    const balance = await connection.getBalance(address);
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    return balanceInSol
}
