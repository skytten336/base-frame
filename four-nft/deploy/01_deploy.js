require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const uris = [
    "ipfs/bafybeibrpcw4xpmmuysxyckc2sthqszmuyxsnup3xxnsrxkwuc27pwalze/0.json",
    "ipfs/bafybeibrpcw4xpmmuysxyckc2sthqszmuyxsnup3xxnsrxkwuc27pwalze/1.json",
    "ipfs/bafybeibrpcw4xpmmuysxyckc2sthqszmuyxsnup3xxnsrxkwuc27pwalze/2.json",
    "ipfs/bafybeibrpcw4xpmmuysxyckc2sthqszmuyxsnup3xxnsrxkwuc27pwalze/3.json",
  ];

  const RandomFourNFT = await hre.ethers.getContractFactory("RandomFourNFT");
  const contract = await RandomFourNFT.deploy(uris);

  await contract.waitForDeployment();

  console.log("✅ Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
