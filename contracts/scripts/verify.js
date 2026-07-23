/**
 * Verify FlowPayEscrow contract on ArcScan.
 *
 * Usage:
 *   npx hardhat verify --network arcTestnet <CONTRACT_ADDRESS> <USDC_ADDRESS>
 *
 * Example:
 *   npx hardhat verify --network arcTestnet 0x1234... 0x3600000000000000000000000000000000000000
 *
 * Prerequisites:
 *   - Contract must be deployed to Arc Testnet
 *   - .env.local must contain ARC_TESTNET_RPC and PRIVATE_KEY
 *   - ArcScan API key is optional (may not be required for Arc Testnet)
 *
 * If ArcScan does not support the standard Etherscan verification API,
 * you can manually verify the contract by uploading the source to:
 *   https://testnet.arcscan.app/verify
 */

const { run } = require("hardhat");

async function main() {
  const contractAddress = process.argv[2];
  const usdcAddress = process.argv[3] || "0x3600000000000000000000000000000000000000";

  if (!contractAddress) {
    console.error("Usage: npx hardhat verify --network arcTestnet <CONTRACT_ADDRESS> [USDC_ADDRESS]");
    console.error("");
    console.error("Example:");
    console.error(
      "  npx hardhat verify --network arcTestnet 0x1234... 0x3600000000000000000000000000000000000000"
    );
    process.exit(1);
  }

  console.log("Verifying FlowPayEscrow at:", contractAddress);
  console.log("USDC address argument:", usdcAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [usdcAddress],
    });
    console.log("✅ Contract verified successfully on ArcScan");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️  Contract is already verified on ArcScan");
    } else {
      console.error("❌ Verification failed:", error.message);
      console.error("");
      console.error("If ArcScan does not support automated verification,");
      console.error("please verify manually at: https://testnet.arcscan.app/verify");
      console.error("");
      console.error("Constructor arguments (ABI-encoded):");
      console.error(
        "  USDC address: " + usdcAddress
      );
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
