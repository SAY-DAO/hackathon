import React, { useState } from "react";
import {
  connectMetaMaskWallet,
  deployLazyFactory,
  deployMainFactory,
  deployMarketPlace,
  mintTheSignature,
  signDoneNeed,
} from "../blockChian";
import MintSteps from "./MintSteps";
import { Box, Grid } from "@mui/material";
import "../assets/style.css";
import impact from "../assets/impact.png";
import liberate from "../assets/liberate.png";
// import decentralize from "../assets/decentralize.png";

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
  const [isLoading, setIsLoading] = useState(false);
  const [userOneAddress, setUserOneAddress] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [userTwoAddress, setUserTwoAddress] = useState();
  const [marketAddress, setMarketAddress] = useState();
  const [mainFactoryAddress, setMainFactoryAddress] = useState();
  const [lazyAddress, setLazyAddress] = useState();
  const [voucher, setVoucher] = useState();
  const [mintHash, setMintHash] = useState();

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
    const { transactionHash } = await mintTheSignature(lazyAddress, voucher);
    setMintHash(transactionHash);
  };

  // Deploys
  const onMainFactoryDeploy = async () => {
    setIsLoading(true);
    const mainFactory = await deployMainFactory(marketAddress);
    setMainFactoryAddress(mainFactory);
    setIsLoading(false);
  };
  const onMarketDeploy = async () => {
    setIsLoading(true);
    const marketPlaceAddress = await deployMarketPlace();
    setMarketAddress(marketPlaceAddress);
    setIsLoading(false);
  };

  const onLazyFactoryDeploy = async () => {
    setIsLoading(true);
    const lazyFactoryAddress = await deployLazyFactory(
      marketAddress,
      mainFactoryAddress
    );
    setLazyAddress(lazyFactoryAddress);
    setIsLoading(false);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-around"
      alignItems="center"
      spacing={5}
      sx={{ padding: 10 }}
    >
      <Grid item xs={8} sx={{ textAlign: "center" }}>
        <h2>SAY DAO - ETH Global</h2>

        <MintSteps
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isDisabled={isDisabled}
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
          mintHash={mintHash}
        />
      </Grid>
      <Grid item xs={4}>
        <Box
          sx={{
            width: 100,
            height: 300,
            padding: 2,
            backgroundColor: "rgb(18, 105, 72)",
            "&:hover": {
              backgroundColor: "primary.main",
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        >
          {mintHash ? (
            <>
              <div className="circle">
                <img src={impact} style={{ padding: 10 }} alt="icon" />
              </div>
              <div className="circle">
                <img src={liberate} style={{ padding: 10 }} alt="icon" />
              </div>
            </>
          ) : (
            <>
              <div className="circle">
                <p className="text">Impact</p>
              </div>
              <div className="circle">
                <p className="text">Liberate</p>
              </div>
            </>
          )}

          <div className="circle">
            <p className="text">Decentralize</p>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
}
