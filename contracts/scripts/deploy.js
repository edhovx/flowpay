const { ethers, network } = require("hardhat");

const OFFICIAL_USDC_ADDRESS = "0x3600000000000000000000000000000000000000";

async function main() {
  const [deployer] = await ethers.getSigners();
  let usdcAddress = process.env.USDC_ADDRESS;

  console.log("Deploying with account:", deployer.address);
  console.log("Network:", network.name);

  const isArcTestnet = network.name === "arcTestnet";

  if (isArcTestnet) {
    // On Arc Testnet: ALWAYS use the official USDC address, never deploy MockUSDC
    usdcAddress = OFFICIAL_USDC_ADDRESS;
    console.log("Using official Arc Testnet USDC address:", usdcAddress);
  } else if (!usdcAddress) {
    // Local Hardhat only: deploy MockUSDC for testing
    console.log("No USDC_ADDRESS provided. Deploying MockUSDC for local testing...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUsdc = await MockUSDC.deploy();
    await mockUsdc.waitForDeployment();
    usdcAddress = await mockUsdc.getAddress();
    console.log("MockUSDC deployed to:", usdcAddress);
  }

  const FlowPayEscrow = await ethers.getContractFactory("FlowPayEscrow");
  const escrow = await FlowPayEscrow.deploy(usdcAddress);
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("FlowPayEscrow deployed to:", address);
  console.log("USDC address:", usdcAddress);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
