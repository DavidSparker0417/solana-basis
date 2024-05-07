import "dotenv/config"
import { Keypair } from "@solana/web3.js";
import { addKeypairToEnvFile, getKeypairFromEnvironment, keypairToSecretKeyJSON } from "@solana-developers/helpers"

function generateKeyPair()
{
    // generate keypair
    const keypair = Keypair.generate();
    console.log("===== Generating keypair ...");
    return keypair;
}
// save& load keypair from stored data (from .env)
let keypair = getKeypairFromEnvironment("SOLANA_SECRET_KEY")
if (!keypair)
{
    keypair = generateKeyPair()
    await addKeypairToEnvFile(keypair, "SOLANA_SECRET_KEY")
}

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);
console.log(`KeyPair JSON :: ${keypairToSecretKeyJSON(keypair)}`)
