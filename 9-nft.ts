import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import fs from "fs"

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'))
  const wallet = Keypair.generate()

  // 1. create metaplex instance
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    )

  // 2. upload assets
  const buffer = fs.readFileSync('assets/nft/image.png')
  const file = toMetaplexFile(buffer, "image.png")
  const imageUri = await metaplex.storage().upload(file)

  // 3. upload metadata
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "My NFT",
    description: "My Description",
    image: imageUri
  })

  // 4. Create NFT
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri,
      name: "My NFT",
      sellerFeeBasisPoints: 0,
    },
    { commitment: "finalized" },
  )

  // 5. Update NFT
  // const nft = await metaplex.nfts().findByMint({mintAddress})
  // const {response} = await metaplex.nfts().update(
  //   {
  //     nftOrSft: nft,
  //     name: "Our NFT",
  //     uri: uri,
  //     sellerFeeBasisPoints: 100,
  //   },
  //   { commitment: "finalized" },
  // )

  // 6. Add NFT to Collection
  const { mintAddress } = await metaplex.nfts().create(
    {
      uri: uri,
      name: "My NFT Collection",
      sellerFeeBasisPoints: 0,
      isCollection: true
    },
    { commitment: 'finalized' },
  )

  const { nft : collectionNft } = await metaplex.nfts().create(
    {
      uri: uri,
      name: "My NFT",
      sellerFeeBasisPoints: 0,
      collection: mintAddress,
    },
    { commitment: 'finalized'}
  )

    await metaplex.nfts().verifyCollection({
      mintAddress: collectionNft.address,
      collectionMintAddress: mintAddress,
      isSizedCollection: true,
    })
}

main()