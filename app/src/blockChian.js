import { ethers } from "ethers";
import LazyFactory from "./build/contracts/artifacts/contracts/LazyFactory.sol/LazyFactory.json";
import MarketPlace from "./build/contracts/artifacts/contracts/MarketPlace.sol/MarketPlace.json";
import MainFactory from "./build/contracts/artifacts/contracts/MainFactory.sol/MainFactory.json";
import { Voucher } from "./voucher";

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
    return marketPlaceContract.address;
  } catch (e) {
    console.log("problem deploying: ");
    console.log(e);
  }
}

export async function deployMainFactory(marketPlaceAddress) {
  try {
    const { signer } = await connectMetaMaskWallet();
    const mainFactory = new ethers.ContractFactory(
      MainFactory.abi,
      MainFactory.bytecode,
      signer
    );

    const mainFactoryContract = await mainFactory.deploy(
      marketPlaceAddress,
      "SAY",
      "impact"
    );
    await mainFactoryContract.deployTransaction.wait(); // loading before confirmed transaction
    return mainFactoryContract.address;
  } catch (e) {
    console.log("problem deploying: ");
    console.log(e);
  }
}

export async function deployLazyFactory(
  marketPlaceAddress,
  mainFactoryAddress
) {
  try {
    const { signer } = await connectMetaMaskWallet();
    const signerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );
    const signerAddress = await signer.getAddress();
    const signerContract = await signerFactory.deploy(
      marketPlaceAddress,
      mainFactoryAddress,
      "SAY",
      "liberate",
      signerAddress
    );
    await signerContract.deployTransaction.wait(); // loading before confirmed transaction
    return signerContract.address;
  } catch (e) {
    console.log("problem deploying: ");
    console.log(e);
  }
}

export async function signDoneNeed(lazyAddress, needId, dollar, priceEth) {
  try {
    const { signer, signerAddress } = await connectMetaMaskWallet();

    const signerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );

    const signerContract = signerFactory.attach(lazyAddress);

    const needVoucher = new Voucher({ contract: signerContract, signer });

    const priceWei = ethers.utils.parseUnits(priceEth.toString(), "ether");

    const priceDollar = dollar.toLocaleString();

    const voucher = await needVoucher.signTransaction(
      needId,
      priceWei,
      priceDollar,
      "tokenUri"
    );
    return { voucher, signerAddress };
  } catch (e) {
    console.log("problem Signing: ");
    console.log(e);
  }
}
export async function mintTheSignature(lazyAddress, voucher) {
  try {
    const { signer: redeemer } = await connectMetaMaskWallet();

    const redeemerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      redeemer
    );

    // Return an instance of a Contract attached to address. This is the same as using the Contract constructor
    // with address and this the interface and signerOrProvider passed in when creating the ContractFactory.
    const redeemerContract = redeemerFactory.attach(lazyAddress);

    const redeemerAddress = await redeemer.getAddress();

    const theVoucher = {
      needId: parseInt(voucher.needId),
      priceWei: voucher.priceWei,
      priceDollar: voucher.priceDollar,
      tokenUri: voucher.tokenUri,
      content: voucher.content,
      signature: voucher.signature,
    };
    console.log(voucher);

    const redeemTx = await redeemerContract.redeem(
      redeemerAddress,
      theVoucher,
      {
        value: voucher.priceWei,
      }
    );
    const transactionData = await redeemTx.wait();

    const eventTokenId = parseInt(transactionData.events[2].args.tokenId);
    const { transactionHash } = transactionData;
    return { eventTokenId, transactionHash };
  } catch (e) {
    console.log("problem buying: ");
    console.log({ e });
  }
}

export async function fetchTreasuryBalance(contractAddress) {
  try {
    window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);

    const balanceInEth = ethers.utils.formatEther(balance);
    return balanceInEth;
  } catch (e) {
    console.log("problem buying: ");
    console.log({ e });
  }
}
