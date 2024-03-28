import { Connection, clusterApiUrl } from "@solana/web3.js";

export function Sol_GetConnection() {
    const connectionByCluster = new Connection(clusterApiUrl("devnet"));
    const connectionByUrl = new Connection("https://api.devnet.solana.com", "confirmed");

    return {
        cluster: connectionByCluster,
        url: connectionByUrl
    }
}

const connection = Sol_GetConnection();
console.log(connection);