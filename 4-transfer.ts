import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { SOL_IsValidWalletAddress } from "./sol-lib/address";
import { getSolToUsdExchangeRate } from "./sol-lib/coinmarket";

async function main() {
    const suppliedToPubkey = process.argv[2] || null;
    const amountToSend = parseFloat(process.argv[3]) || 1.0
    if (!suppliedToPubkey) {
        console.log(`Please provide a public key to send to`);
        process.exit(1);
    }
    if (!SOL_IsValidWalletAddress(suppliedToPubkey)) {
        console.log(`Recipient address(${suppliedToPubkey}) is invalid!`);
        process.exit(1);
    }

    const senderKeypair = getKeypairFromEnvironment("SOLANA_SECRET_KEY");
    console.log(`suppliedToPubkey: ${suppliedToPubkey}`);
    const toPubkey = new PublicKey(suppliedToPubkey);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    console.log(
        `✅ Loaded our own keypair, the destination public key, and connected to Solana`
    );
    const transaction = new Transaction();
    const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey,
        lamports: amountToSend * LAMPORTS_PER_SOL,
    });
    transaction.add(sendSolInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [
        senderKeypair,
    ]);
    const amountInUSD = await getSolToUsdExchangeRate() * amountToSend;
    console.log(
        `💸 Finished! Sent ${amountToSend}($${amountInUSD}) to the address ${toPubkey}. `
    );
    console.log(`Transaction signature is ${signature}`);
}

main();