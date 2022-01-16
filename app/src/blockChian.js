import { ethers } from "ethers";
import LazyFactory from "./build/contracts/artifacts/contracts/LazyFactory.sol/LazyFactory.json";
import FinalFactory from "./build/contracts/artifacts/contracts/FinalFactory.sol/FinalFactory.json";
import Treasury from "./build/contracts/artifacts/contracts/Treasury.sol/Treasury.json";
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

export async function deployTreasury() {
  try {
    const { signer } = await connectMetaMaskWallet();
    const treasuryFactory = new ethers.ContractFactory(
      Treasury.abi,
      Treasury.bytecode,
      signer
    );

    const TreasuryContract = await treasuryFactory.deploy();
    await TreasuryContract.deployTransaction.wait(); // loading before confirmed transaction
    return TreasuryContract.address;
  } catch (e) {
    console.log("problem deploying: ");
    console.log(e);
  }
}

export async function deployMainFactory(TreasuryAddress) {
  try {
    const { signer } = await connectMetaMaskWallet();
    const mainFactory = new ethers.ContractFactory(
      MainFactory.abi,
      MainFactory.bytecode,
      signer
    );

    const mainFactoryContract = await mainFactory.deploy(
      TreasuryAddress,
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

export async function deployLazyFactory(TreasuryAddress, mainFactoryAddress) {
  try {
    const { signer } = await connectMetaMaskWallet();
    const signerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );
    const signerAddress = await signer.getAddress();
    const signerContract = await signerFactory.deploy(
      TreasuryAddress,
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
export async function deployFinalFactory(TreasuryAddress) {
  try {
    const { signer } = await connectMetaMaskWallet();
    const signerFactory = new ethers.ContractFactory(
      FinalFactory.abi,
      FinalFactory.bytecode,
      signer
    );
    const signerContract = await signerFactory.deploy(
      TreasuryAddress,
      "SAY",
      "decentralize"
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

export async function fetchLazyTokenUri(lazyAddress, tokenId) {
  try {
    const { signer } = await connectMetaMaskWallet();

    const lazyFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );

    const lazyContract = lazyFactory.attach(lazyAddress);

    const uri = await lazyContract.tokenURI(tokenId);
    return uri;
  } catch (e) {
    console.log("problem buying: ");
    console.log({ e });
  }
}

export async function fetchFinalTokenUri(finalFactoryAddress, tokenId) {
  try {
    const { signer } = await connectMetaMaskWallet();

    const finalFactory = new ethers.ContractFactory(
      FinalFactory.abi,
      FinalFactory.bytecode,
      signer
    );

    const finalContract = finalFactory.attach(finalFactoryAddress);

    const uri = await finalContract.tokenURI(tokenId);
    return uri;
  } catch (e) {
    console.log("problem buying: ");
    console.log({ e });
  }
}

export async function checkPairAvailability(lazyAddress, pairId) {
  try {
    const { signer } = await connectMetaMaskWallet();

    const lazyFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );

    const lazyContract = lazyFactory.attach(lazyAddress);

    const transaction = await lazyContract.checkToken(pairId);

    return transaction;
  } catch (e) {
    console.log("problem buying: ");
    console.log({ e });
  }
}

export async function mintThePair(finalFactoryAddress, pairId, ipfs) {
  try {
    const { signer } = await connectMetaMaskWallet();
    const signerAddress = await signer.getAddress();
    const finalFactory = new ethers.ContractFactory(
      FinalFactory.abi,
      FinalFactory.bytecode,
      signer
    );

    const finalContract = finalFactory.attach(finalFactoryAddress);

    const priceWei = ethers.utils.parseUnits((0.02).toString(), "ether");
    console.log(priceWei);
    const transaction = await finalContract.safeMint(
      signerAddress,
      pairId,
      ipfs,
      {
        value: priceWei,
      }
    );
    const transactionData = await transaction.wait();

    console.log(transactionData);

    return transactionData;
  } catch (e) {
    console.log("problem buying: ");
    console.log({ e });
  }
}
