const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const fs = require("fs");

describe("initialize-platform", () => {
  it("Initializes the platform", async () => {
    // Load wallet
    const walletPath = process.env.HOME + "/.config/solana/id.json";
    const walletKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(walletPath, "utf8")))
    );
    
    const connection = new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed");
    const wallet = new anchor.Wallet(walletKeypair);
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
    anchor.setProvider(provider);

    const programId = new PublicKey("4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA");
    
    // Load IDL
    const idl = JSON.parse(fs.readFileSync(__dirname + "/../target/idl/odv_escrow.json", "utf8"));
    const program = new anchor.Program(idl, programId, provider);

    const [platformConfigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform_config")],
      programId
    );

    console.log("\n" + "=".repeat(60));
    console.log("Platform Config PDA:", platformConfigPDA.toString());
    console.log("Admin:", provider.wallet.publicKey.toString());
    console.log("Program ID:", programId.toString());
    console.log("=".repeat(60) + "\n");

    const fixedBackingAmount = new anchor.BN(1_000_000);

    const tx = await program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Platform initialized!");
    console.log("Transaction:", tx);
    console.log("Explorer: https://explorer.solana.com/tx/" + tx + "?cluster=devnet\n");
  });
});
