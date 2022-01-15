import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  connectMetaMaskWallet,
  deployLazyFactory,
  deployMainFactory,
  deployMarketPlace,
  mintTheSignature,
  signDoneNeed,
} from "../blockChian";
import LazyFactory from "../build/contracts/artifacts/contracts/LazyFactory.sol/LazyFactory.json";
import { Voucher } from "../voucher";
import MintSteps from "./MintSteps";

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
      sayName: "Atousa",
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
  const [marketAddress, setMarketAddress] = useState("");
  const [mainFactoryAddress, setMainFactoryAddress] = useState("");
  const [lazyAddress, setLazyAddress] = useState("");
  const [voucher, setVoucher] = useState();
  useEffect(() => {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }, []);

  // Signature
  const onSign = async () => {
    const { voucher, signerAddress } = await signDoneNeed(
      lazyAddress,
      needs[0].id,
      2000,
      0.1
    );
    setUserOneAddress(signerAddress);
    setVoucher(voucher);
  };

  // Mint
  const onMint = async () => {
    const { signerAddress } = await connectMetaMaskWallet();
    setUserTwoAddress(signerAddress);
    const redeemed = await mintTheSignature(lazyAddress, voucher);
    console.log(redeemed);
  };

  // Deploys
  const onMainFactoryDeploy = async () => {
    const mainFactory = await deployMainFactory(marketAddress);
    setMainFactoryAddress(mainFactory);
  };
  const onMarketDeploy = async () => {
    const marketPlaceAddress = await deployMarketPlace();
    setMarketAddress(marketPlaceAddress);
  };

  const onLazyFactoryDeploy = async () => {
    const lazyFactoryAddress = await deployLazyFactory(
      marketAddress,
      mainFactoryAddress
    );
    setLazyAddress(lazyFactoryAddress);
  };

  return (
    <div>
      <MintSteps
        needs={needs}
        onMarketDeploy={onMarketDeploy}
        onMainFactoryDeploy={onMainFactoryDeploy}
        marketAddress={marketAddress}
        mainFactoryAddress={mainFactoryAddress}
        onLazyFactoryDeploy={onLazyFactoryDeploy}
        lazyAddress={lazyAddress}
        onSign={onSign}
        userOneAddress={userOneAddress}
        voucher={voucher}
        onMint={onMint}
        userTwoAddress={userTwoAddress}
        inputValue={inputValue}
      />
    </div>
  );
}
