const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = "0x8F423758Ac39B6962CB052c819d5F1761768fCb2";
  const recipient = "0x8181ac4ee632dd0a9ce9380b07a8842b18001702"; 
  const amount = ethers.parseUnits("1000000", 18); 

  const token = await ethers.getContractAt("ETHXRP", tokenAddress);
  const tx = await token.transfer(recipient, amount);
  await tx.wait();

  console.log(`✅ Enviados ${ethers.formatUnits(amount, 18)} EXRP a ${recipient}`);
}

main().catch(console.error);
