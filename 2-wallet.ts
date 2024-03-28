import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Cluster, Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { SOL_IsValidWalletAddress, SOL_QueryBalance } from "./sol-lib/address";

type WalletInfo = {
    address: string,
    net: Cluster
}
async function test() {
    const myWallet: WalletInfo = {
        address: "BSvQ9jmC139mFQwnWScW1Px5acrYXn9ydPvpq7Js8b1u",
        net: 'devnet'
    };
    const devWallet: WalletInfo = {
        address: getKeypairFromEnvironment("SOLANA_SECRET_KEY").publicKey.toBase58(),
                /*BnkW1f3LgF7XXrbT5Jk6iVSAecJXgk6oRMkt3XPdf17R*/
        net: 'devnet'
    }

    let sol = await SOL_QueryBalance(myWallet.address, myWallet.net);
    console.log(`My wallet balance is ${sol} SOL`)
    sol = await SOL_QueryBalance(devWallet.address, devWallet.net);
    console.log(`Dev's balance is ${sol} SOL`)

    // const invalidAddress = "134doi3eldkay4";
    // const validAddress = myWallet.address;
    // console.log(`Checking valid address for ${invalidAddress}... [${SOL_IsValidWalletAddress(invalidAddress)}]`)
    // console.log(`Checking valid address for ${validAddress}... [${SOL_IsValidWalletAddress(validAddress)}]`)
}

test()