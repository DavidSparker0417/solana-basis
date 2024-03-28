import * as web3 from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment, airdropIfRequired } from "@solana-developers/helpers";
import { SOL_QueryBalance } from "./sol-lib/address";


async function main() {

    const targetAddress = getKeypairFromEnvironment('SOLANA_SECRET_KEY').publicKey;
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const reqAmount = parseFloat(process.argv[2]);

    if (!reqAmount) {
        console.log("Please enter the sol amount to receive.");
        process.exit(1)
    }
    console.log(`Requesting airdop ${reqAmount} SOL for ${targetAddress}`)
    const newBalance = await airdropIfRequired(
        connection,
        targetAddress,
        reqAmount * web3.LAMPORTS_PER_SOL,
        reqAmount * 0.5 * web3.LAMPORTS_PER_SOL,
    );
    console.log(`Current balance : ${newBalance/web3.LAMPORTS_PER_SOL} SOL.`);
    const finalBalance = await SOL_QueryBalance(targetAddress.toBase58());
    console.log(`Balance = ${finalBalance}`)
}

main();
