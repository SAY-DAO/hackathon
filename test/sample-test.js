const { expect } = require("chai");
const hardhat = require("hardhat");
const { Voucher } = require("../app/src/voucher");
const { ethers } = hardhat;

async function deploy() {
  const [signer, redeemer, newBuyer] = await ethers.getSigners();

  const fee = ethers.utils.parseUnits("0.00000001", "ether");

  const marketFactory = await ethers.getContractFactory("MarketPlace");
  const marketContract = await marketFactory.deploy();
  await marketContract.deployed();
  const marketAddress = marketContract.address;
  const mainFactory = await ethers.getContractFactory("MainFactory");
  const mainContract = await mainFactory.deploy(marketAddress, "SAY", "gSAY");
  await mainContract.deployed();
  const mainFactoryAddress = await mainContract.address;

  const lazyFactory = await ethers.getContractFactory("LazyFactory", signer);
  const lazyContract = await lazyFactory.deploy(
    marketAddress,
    mainFactoryAddress,
    "SAY",
    "gSAY",
    signer.address
  );
  await lazyContract.deployed();
  const factoryAddress = lazyContract.address;

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = lazyFactory.connect(redeemer);
  const redeemerContract = redeemerFactory.attach(factoryAddress);

  return {
    signer,
    redeemer,
    newBuyer,
    lazyContract,
    redeemerContract,
    marketContract,
    mainContract,
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

  it("Should deploy lazyFactory and mainFactory and sign a voucher", async function () {
    const { signer, lazyContract } = await deploy();
    const priceInWei = ethers.utils.parseUnits("0.054", "ether");

    const theVoucher = new Voucher({
      contract: lazyContract,
      signer: signer,
    });
    const voucher = await theVoucher.signTransaction(
      1,
      priceInWei,
      "150",
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
    );
    expect(voucher.signature).not.to.equal(0);
  });

  it("Should mint two tokens for a voucher", async function () {
    const { signer, redeemer, lazyContract, redeemerContract, mainContract } =
      await deploy();
    const priceInWei = ethers.utils.parseUnits("0.054", "ether");
    const theVoucher = new Voucher({
      contract: lazyContract,
      signer: signer,
    });
    const voucher = await theVoucher.signTransaction(
      1,
      priceInWei,
      "150",
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
    );
    await expect(
      redeemerContract.redeem(redeemer.address, voucher, {
        value: priceInWei,
      })
    )
      .to.emit(redeemerContract, "Transfer")
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        signer.address,
        voucher.needId
      )
      .and.to.emit(lazyContract, "Transfer") // transfer from artist to redeemer
      .withArgs(signer.address, redeemer.address, voucher.needId)
      .and.to.emit(lazyContract, "RedeemedAndMinted") // tokenId is the needId
      .withArgs(voucher.needId)
      .and.to.emit(mainContract, "Minted") // tokenId is the needId
      .withArgs(voucher.tokenUri);
  });
});
