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
      <div style={{ backgroundColor: "lightGray", padding: 20 }}>
        <button onClick={onMarketDeploy}>Deploy SAY Market</button>
        <button onClick={onMainFactoryDeploy}>Deploy SAY Main Factory</button>

        <div style={{ margin: 30 }}>
          <p>
            Treasury Balance: <span>{}</span>
          </p>
          <p>
            market address:{" "}
            <span>
              <a href={`https://goerli.etherscan.io/address/${marketAddress}`}>
                {marketAddress}
              </a>
            </span>
          </p>
          <p>
            main address:{" "}
            <span>
              <a href={`https://goerli.etherscan.io/address/${mainFactoryAddress}`}>
                {mainFactoryAddress}
              </a>
            </span>
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "black", color: "white", padding: 20 }}>
        <button onClick={onLazyFactoryDeploy}>Deploy Lazy Factory</button>

        <div style={{ margin: 30 }}>
          <p>
            address:{" "}
            <span>
              <a href={`https://goerli.etherscan.io/address/${lazyAddress}`}>
                {lazyAddress}
              </a>
            </span>
          </p>
        </div>
        <div>
          <div style={{ margin: 30 }}>
            <button
              type="button"
              className="collapsible"
              style={{
                backgroundColor: "#777",
                color: "white",
                cursor: "pointer",
                padding: "10px",
                border: "none",
                textAlign: "left",
                outline: "none",
                fontSize: "15px",
              }}
            >
              Need Details
            </button>
            <div className="content">
              <img src={needs[0].imageUrl} alt="icon" width={50} />
              <img src={needs[0].child.avatarUrl} alt="icon" width={50} />
              <pre>{JSON.stringify(needs, 0, 2)}</pre>
            </div>
          </div>
          <div style={{ margin: 30 }}>
            <button onClick={onSign}>Sign The Done Need</button>
            <p>
              Account 1: <span>{userOneAddress}</span>
            </p>
          </div>
        </div>
      </div>
      <h5>
        User2 -------------------------------------------------------------
      </h5>
      <div style={{ backgroundColor: "#287a32", color: "white", padding: 20 }}>
        <div style={{ margin: 30 }}>
          <button
            type="button"
            className="collapsible"
            style={{
              backgroundColor: "#777",
              color: "white",
              cursor: "pointer",
              padding: "10px",
              border: "none",
              textAlign: "left",
              outline: "none",
              fontSize: "15px",
            }}
          >
            Voucher Details
          </button>
          <div className="content">
            <pre>
              {voucher && voucher.signature && JSON.stringify(voucher, 0, 2)}
            </pre>
          </div>
          <button onClick={onMint}> Mint The Signature</button>
          <p>
            Account 2: <span>{userTwoAddress}</span>
          </p>
          <p>Minted Signature:{inputValue}</p>
        </div>
      </div>
    </div>
  );
}
