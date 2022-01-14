import { ethers } from "ethers";
import LazyFactory from "./build/contracts/artifacts/contracts/LazyFactory.sol/LazyFactory.json";
import MarketPlace from "./build/contracts/artifacts/contracts/MarketPlace.sol/MarketPlace.json";

export async function connectMetaMaskWallet() {
  try {
    window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    return { signerAddress, signer, chainId };
  } catch (e) {
    throw new Error("🦊 Connect to Metamask using the top right button.");
  }
}

export async function deployLazyFactory(marketPlaceAddress) {
  try {
    const { signer } = await connectMetaMaskWallet();
    const signerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );
    const userOneAddress = await signer.getAddress();
    const signerContract = await signerFactory.deploy(
      marketPlaceAddress,
      "SAY",
      "aSAY",
      userOneAddress
    );
    await signerContract.deployTransaction.wait(); // loading before confirmed transaction
  } catch (e) {
    console.log("problem deploying: ");
  }
}

export async function deployMarketPlace() {
  try {
    const { signer } = await connectMetaMaskWallet();
    const marketPlaceFactory = new ethers.ContractFactory(
      MarketPlace.abi,
      MarketPlace.bytecode,
      signer
    );

    const marketPlaceContract = await marketPlaceFactory.deploy();
    await marketPlaceContract.deployTransaction.wait(); // loading before confirmed transaction

  } catch (e) {
    console.log("problem deploying: ");
  }
}
