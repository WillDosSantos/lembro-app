const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // MemorialRegistry
  const Registry = await ethers.getContractFactory("MemorialRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment(); // ethers v6 style
  const registryAddr = await registry.getAddress();
  console.log("MemorialRegistry:", registryAddr);

  // RemembranceBadges
  const Badges = await ethers.getContractFactory("RemembranceBadges");
  const badges = await Badges.deploy("ipfs://REPLACE_OPTIONAL_BASE/", deployer.address);
  await badges.waitForDeployment();
  const badgesAddr = await badges.getAddress();
  console.log("RemembranceBadges:", badgesAddr);

  // Example: grant MINTER_ROLE later if you have a server signer
  // const MINTER_ROLE = await badges.MINTER_ROLE();
  // await (await badges.grantRole(MINTER_ROLE, "0xYourServerSigner")).wait();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
