const { expect } = require("chai");
const hardhat = require("hardhat");
const { ethers } = hardhat;

describe("MarketPlace", function () {
  it("Should deploy MarketPlace", async function () {
    const marketFactory = await ethers.getContractFactory("MarketPlace");
    const marketContract = await marketFactory.deploy();
    await marketContract.deployed();
    const marketPlaceAddress = marketContract.address;
    expect(marketPlaceAddress).not.to.equal(0);
  });
});
