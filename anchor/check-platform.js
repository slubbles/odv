const { PublicKey } = require("@solana/web3.js");

const programId = new PublicKey("4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA");
const [platformConfigPDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("platform_config")],
  programId
);

console.log("Program ID:", programId.toString());
console.log("Platform Config PDA:", platformConfigPDA.toString());
console.log("Bump:", bump);
