const { expect } = require("chai");
const hardhat = require("hardhat");
const { Voucher } = require("../app/src/voucher");
const { ethers } = hardhat;

async function deploy() {
  const [artist, redeemer, newBuyer, _] = await ethers.getSigners();

  const fee = ethers.utils.parseUnits("0.00000001", "ether");

  const marketFactory = await ethers.getContractFactory("MarketPlace");
  const marketContract = await marketFactory.deploy();
  await marketContract.deployed();
  const marketAddress = marketContract.address;

  const lazyFactory = await ethers.getContractFactory("LazyFactory", artist);
  const lazyContract = await lazyFactory.deploy(
    marketAddress,
    "SAY",
    "gSAY",
    artist.address
  );
  await lazyContract.deployed();
  const factoryAddress = lazyContract.address;

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = lazyFactory.connect(redeemer);
  const redeemerContract = redeemerFactory.attach(factoryAddress);

  return {
    artist,
    redeemer,
    newBuyer,
    lazyContract,
    redeemerContract,
    marketContract,
    fee,
  };
}

describe("MarketPlace", function () {
  it("Should deploy MarketPlace", async function () {
    const marketFactory = await ethers.getContractFactory("MarketPlace");
    const marketContract = await marketFactory.deploy();
    await marketContract.deployed();
    const marketPlaceAddress = marketContract.address;
    expect(marketPlaceAddress).not.to.equal(0);
  });

  it("Should deploy lazyFactory sign a voucher", async function () {
    const { artist, lazyContract } = await deploy();
    const priceInWei = ethers.utils.parseUnits("0.054", "ether");

    const theVoucher = new Voucher({
      contract: lazyContract,
      signer: artist,
    });
    const voucher = await theVoucher.signTransaction(
      1,
      priceInWei,
      "150",
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
    );
    expect(voucher.signature).not.to.equal(0);
  });
});
