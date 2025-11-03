const { ethers } = require("hardhat");

async function main() {
  // Initial Tokens defined
  const initialSupply = ethers.parseUnits("1000000", 18);

  // Get the Contract ETHXRP
  const ETHXRP = await ethers.getContractFactory("ETHXRP");

  console.log("🚀 Deploying Smart Contract ETHXRP...");

  // Deploy the contract with the initial supply
  const ethxrp = await ETHXRP.deploy(initialSupply);

  await ethxrp.waitForDeployment();

  console.log(`✅ Contract deployed in: ${await ethxrp.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
