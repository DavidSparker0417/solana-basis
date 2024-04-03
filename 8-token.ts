import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"

async function buildCreateMintTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  decmials: number
): Promise<web3.Transaction> {
  const lamports = await token.getMinimumBalanceForRentExemptAccount(connection);
  const accountKeyPair = web3.Keypair.generate();
  const programId = token.TOKEN_PROGRAM_ID

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeyPair.publicKey,
      space: token.MINT_SIZE,
      lamports,
      programId
    }),
    token.createInitializeMintInstruction(
      accountKeyPair.publicKey,
      decmials,
      payer,
      payer,
      programId
    )
  )

  return transaction
}

async function buildCreateTokenAccountTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  mint: web3.PublicKey
) : Promise<web3.Transaction> {
  const mintState = await token.getMint(connection, mint)
  const accountKeyPair = await web3.Keypair.generate()
  const space = token.getAccountLenForMint(mintState)
  const lamports = await connection.getMinimumBalanceForRentExemption(space)
  const programId = token.TOKEN_PROGRAM_ID

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeyPair.publicKey,
      space,
      lamports,
      programId
    }),
    token.createInitializeAccountInstruction(
      accountKeyPair.publicKey,
      mint,
      payer,
      programId
    )
  )
  return transaction
}

async function buildCreateAssociatedTokenAccountTransaction(
  payer: web3.PublicKey,
  mint: web3.PublicKey
) : Promise<web3.Transaction> {
  const associatedTokenAddress = await token.getAssociatedTokenAddress(mint, payer, false)
  const transaction = new web3.Transaction().add(
    token.createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAddress,
      payer,
      mint
    )
  )

  return transaction
}

async function buildMintToTransaction(
  authority: web3.PublicKey,
  mint: web3.PublicKey,
  amount: number,
  destination: web3.PublicKey
) : Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createMintToInstruction(
      mint,
      destination,
      authority,
      amount
    )
  )
  return transaction
}

async function buildTransferTransaction(
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createTransferInstruction(
      source,
      destination,
      owner,
      amount
    )
  )
  return transaction
}

async function buildBurnTransaction(
  account: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createBurnInstruction(
      account,
      mint, 
      owner,
      amount
    )
  )
  return transaction;
}

async function buildApproveTransaction(
  account: web3.PublicKey,
  delegate: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createApproveInstruction(
      account,
      delegate,
      owner,
      amount
    )
  )

  return transaction
}

async function buildRevokeTransaction(
  account: web3.PublicKey,
  owner: web3.PublicKey,
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createRevokeInstruction(
      account,
      owner,
    )
  )

  return transaction
}