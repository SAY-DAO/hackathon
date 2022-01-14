import React, { useState } from "react";
import { ethers } from "ethers";
import { connectMetaMaskWallet } from "../blockChian";
import LazyFactory from "../build/contracts/artifacts/contracts/LazyFactory.sol/LazyFactory.json";

const needs = [
  {
    id: 7170,
    imageUrl:
      "https://api.sayapp.company/files/3-child/needs/7170-need/39255e94b04e47e6b1154fb93898b1e0.png",
    name: "Accessories",
    cost: 190000,
    isDone: true,
    type: 1,
    created: "Wed, 01 Dec 2021 11:06:48 GMT",
    doneAt: "Sat, 25 Dec 2021 04:45:36 GMT",
    child: {
      id: 3,
      sayName: "Mahmood",
      avatarUrl:
        "https://api.sayapp.company/files/3-child/3-sleptAvatar_0010010003.png",
    },
  },
];

export default function Main() {
  const [adminAddress, setAdminAddress] = useState("");
  const [userOneAddress, setUserOneAddress] = useState("");
  const [userTwoAddress, setUserTwoAddress] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [sayFactoryAddress, setSayFactoryAddress] = useState("");

  // Deploy
  const onDeployFactory = async () => {
    const { signer } = await connectMetaMaskWallet();
    const signerFactory = new ethers.ContractFactory(
      LazyFactory.abi,
      LazyFactory.bytecode,
      signer
    );
    const artistWalletAddress = await signer.getAddress();
    const signerContract = await signerFactory.deploy(
      "SAY",
      "gSAY",
      adminAddress
    );
    await signerContract.deployTransaction.wait(); // loading before confirmed transaction
  };
  // Signature
  const onSign = async () => {
    let voucher;
    try {
      const { signer, signerAddress } = await connectMetaMaskWallet();
      setUserOneAddress(signerAddress);

      const signerFactory = new ethers.ContractFactory(
        LazyFactory.abi,
        LazyFactory.bytecode,
        signer
      );

      const signerContract = signerFactory.attach(sayFactoryAddress);

      const theSignature = new Voucher({ contract: signerContract, signer });
    } catch (e) {
      console.log("problem Signing: ");
      console.log(e);
    }
  };

  // Mint
  const onMint = async () => {
    const { signer, signerAddress } = await connectMetaMaskWallet();
    setUserTwoAddress(signerAddress);
  };

  return (
    <div>
      <header className="App-header">
        <p>A Random Need Object</p>
      </header>
      <pre>{JSON.stringify(needs, 0, 2)}</pre>
      <br />
      1 - ------------------------------------------------------------
      <br />
      <br />
      <div>
        <button onClick={onSign}>User1 - Sign The Done Need</button>
        <p>
          Account 1: <span>{userOneAddress}</span>{" "}
        </p>
        <p>
          Balance: <span>{userOneAddress}</span>{" "}
        </p>
        <p>Signature:</p>
      </div>
      <br />
      2 - ------------------------------------------------------------
      <br />
      <br />
      <input
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        placeholder="signature"
      />
      <br />
      <button onClick={onMint}>User2 - Mint The Signature</button>
      <p>
        Account 2: <span>{userOneAddress}</span>{" "}
      </p>
      <p>
        Balance: <span>{userTwoAddress}</span>{" "}
      </p>
      <p>Minted Signature:{inputValue}</p>
    </div>
  );
}
