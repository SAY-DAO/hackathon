import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import { Grid, Box, TextField } from "@mui/material";
import {
  checkPairAvailability,
  connectMetaMaskWallet,
  fetchFinalTokenUri,
  fetchLazyTokenUri,
  fetchTreasuryBalance,
  mintThePair,
} from "../blockChian";
import client from "../ipfs";

export default function MintSteps({
  needs,
  onTreasuryDeploy,
  onMainFactoryDeploy,
  treasuryAddress,
  mainFactoryAddress,
  onLazyFactoryDeploy,
  onFinalFactoryDeploy,
  lazyAddress,
  finalFactoryAddress,
  onSign,
  userOneAddress,
  voucher,
  onMint,
  userTwoAddress,
  setIsLoading,
  isLoading,
  isDisabled,
  mintHash,
}) {
  const [balance, setBalance] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [finalButton, setFinalButton] = useState(false);
  const [tokenUriButton, setTokenUriButton] = useState(false);
  const [userThreeAddress, setUserThreeAddress] = useState();
  const [finalMintHash, setFinalMintHash] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [tokenURI, setTokenURI] = useState();
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

  // // tokenUri
  // useEffect(() => {
  //   if (imageUrl) {
  //     // create the tokenURI
  //     const data = JSON.stringify({
  //       title,
  //       price,
  //       imageUrl,
  //     });
  //     const added = await client.add(data);
  //     const url = `${process.env.REACT_APP_IPFS}/ipfs/${added.path}`;
  //     setTokenUri(url);
  //   }
  // }, [successMyStore, signChecked, imageUrl]);

  const balanceHandler = async () => {
    setIsLoading(true);
    const theBalance = await fetchTreasuryBalance(treasuryAddress);
    setBalance(theBalance);
    setIsLoading(false);
  };
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const onCheckPair = async () => {
    setIsLoading(true);
    const respond = await checkPairAvailability(lazyAddress, inputValue);
    console.log(respond);
    if (respond === true) {
      setFinalButton(true);
    } else {
      setFinalButton(false);
    }
    setIsLoading(false);
  };

  // Final Mint
  const onFinalMint = async () => {
    const lazyUri = lazyTokenUri();
    setTokenUriButton(true);

    setIsLoading(true);
    const { signerAddress } = await connectMetaMaskWallet();
    setUserThreeAddress(signerAddress);
    const { transactionHash } = await mintThePair(
      finalFactoryAddress,
      inputValue
      // ipfs
    );
    setFinalMintHash(transactionHash);
    setIsLoading(false);
    if (transactionHash) {
      setTokenUriButton(true);
    }
  };

  // tokenUri LazyFactory
  const lazyTokenUri = async () => {
    setIsLoading(true);
    const tokenUri = await fetchLazyTokenUri(lazyAddress, inputValue);
    return tokenUri;
  };

  // tokenUri FinalFactory
  const finalTokenUri = async () => {
    setIsLoading(true);
    const tokenUri = await fetchFinalTokenUri(finalFactoryAddress, inputValue);
    setTokenURI(tokenUri);
    setIsLoading(false);
  };

  // IPFS
  const handleIpfsUpload = async () => {
    await fetch(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Random_walk_25000.gif/640px-Random_walk_25000.gif",
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
      }
    )
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then(async (blob) => {
        blob.lastModifiedDate = new Date();
        blob.name = "fileName";
        // Here, I use it to make an image appear on the page
        let objectURL = URL.createObjectURL(blob);
        let myImage = new Image();

        if (client) {
          try {
            const added = await client.add(blob, {
              progress: (prog) => console.log(`received: ${prog}`),
            });
            console.log(added);

            const url = `${process.env.REACT_APP_IPFS}/ipfs/${added.path}`;
            setIpfsUrl(url);

          } catch (e) {
          }
        }

        myImage.src = objectURL;
        document.getElementById("myImg").appendChild(myImage);
      });
  };

  return (
    <div style={{ textAlign: "left" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div>
            <h4>SAY Smart Contracts</h4>
            <p>
              Treasury:
              <span>
                <a
                  href={`https://goerli.etherscan.io/address/${treasuryAddress}`}
                >
                  {treasuryAddress}
                </a>
              </span>
            </p>
            <p>
              MainFactory:
              <span>
                <a
                  href={`https://goerli.etherscan.io/address/${mainFactoryAddress}`}
                >
                  {mainFactoryAddress}
                </a>
              </span>
            </p>
            <p>
              FinalFactory:
              <span>
                <a
                  href={`https://goerli.etherscan.io/address/${finalFactoryAddress}`}
                >
                  {finalFactoryAddress}
                </a>
              </span>
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid>
            <LoadingButton
              disabled={Boolean(treasuryAddress)}
              loading={isLoading}
              variant="contained"
              onClick={onTreasuryDeploy}
            >
              1-Deploy Treasury
            </LoadingButton>
            <LoadingButton
              loading={isLoading}
              disabled={Boolean(!treasuryAddress || mainFactoryAddress)}
              sx={{ margin: 2 }}
              variant="contained"
              onClick={onMainFactoryDeploy}
            >
              2 -Deploy Main Factory
            </LoadingButton>
            <LoadingButton
              loading={isLoading}
              disabled={Boolean(!treasuryAddress || finalFactoryAddress)}
              sx={{ margin: 2 }}
              variant="contained"
              onClick={onFinalFactoryDeploy}
            >
              3 -Deploy Final Factory
            </LoadingButton>

            <div>
              <p>
                Treasury Balance: <span>{balance} ether</span>
              </p>
              <LoadingButton
                onClick={balanceHandler}
                disabled={Boolean(!treasuryAddress)}
                variant="outlined"
              >
                Balance
              </LoadingButton>
            </div>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <div>
            <h4>User 1: Take care of the need and sign (Impact) </h4>
            <p>
              Account 1: <span>{userOneAddress}</span>
            </p>
            <p>
              LazyFactory:
              <span>
                <a href={`https://goerli.etherscan.io/address/${lazyAddress}`}>
                  {lazyAddress}
                </a>
              </span>
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid>
            <div style={{ margin: 30 }}>
              <LoadingButton
                loading={isLoading}
                disabled={Boolean(!mainFactoryAddress || lazyAddress)}
                variant="contained"
                onClick={onLazyFactoryDeploy}
              >
                Deploy Lazy Factory
              </LoadingButton>
            </div>

            <div>
              <div style={{ margin: 30 }}>
                <LoadingButton
                  disabled={Boolean(!lazyAddress)}
                  variant="contained"
                  color="secondary"
                  type="button"
                  className="collapsible"
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    border: "none",
                    textAlign: "left",
                    outline: "none",
                    fontSize: "10px",
                  }}
                >
                  Need Details
                </LoadingButton>

                <div className="content">
                  {lazyAddress && (
                    <pre style={{ maxWidth: "100%", overflow: "scroll" }}>
                      {JSON.stringify(needs, 0, 2)}
                    </pre>
                  )}
                </div>
                <img src={needs[0].imageUrl} alt="icon" width={50} />
                <img src={needs[0].child.avatarUrl} alt="icon" width={50} />
              </div>
              <div style={{ margin: 30 }}>
                <LoadingButton
                  disabled={Boolean(!lazyAddress)}
                  variant="contained"
                  onClick={onSign}
                >
                  Sign The Done Need
                </LoadingButton>
              </div>
            </div>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled={isDisabled}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <div>
            <h4>User 2: Mint two NFTS (Liberate)</h4>
            <p>
              Account 2: <span>{userTwoAddress}</span>
            </p>

            <p>
              TX:
              <span>
                <a href={`https://goerli.etherscan.io/tx/${mintHash}`}>
                  {mintHash}
                </a>
              </span>
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid style={{ margin: 30 }}>
            <LoadingButton
              disabled={Boolean(!voucher)}
              variant="contained"
              color="secondary"
              type="button"
              className="collapsible"
              style={{
                cursor: "pointer",
                padding: "10px",
                border: "none",
                textAlign: "left",
                outline: "none",
                fontSize: "10px",
                margin: 5,
              }}
            >
              Voucher Details
            </LoadingButton>
            <div className="content">
              <pre style={{ maxWidth: "100%", overflow: "scroll" }}>
                {voucher && voucher.signature && JSON.stringify(voucher, 0, 2)}
              </pre>
            </div>
            <br />
            <LoadingButton
              loading={isLoading}
              disabled={Boolean(mintHash || !voucher)}
              variant="contained"
              onClick={onMint}
            >
              Mint The Signature
            </LoadingButton>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled={isDisabled}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <div>
            <h4>User 3: Mint The Final NFT (Decentralize)</h4>
            <p>
              Account 3: <span>{userThreeAddress}</span>
            </p>
            <p>
              TX:
              <a href={`https://goerli.etherscan.io/tx/${finalMintHash}`}>
                {finalMintHash}
              </a>
            </p>
            <p>
              IPFS:
              <a href={ipfsUrl}>{ipfsUrl}</a>
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid style={{ margin: 30 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                size="small"
                id="outlined-pair"
                label="PairId"
                value={inputValue}
                onChange={handleChange}
              />
              <LoadingButton
                color="secondary"
                variant="contained"
                onClick={onCheckPair}
              >
                Check The Pair
              </LoadingButton>
              {finalButton && (
                <LoadingButton variant="contained" onClick={onFinalMint}>
                  Mint The Pair
                </LoadingButton>
              )}
              {tokenUriButton && (
                <LoadingButton
                  variant="contained"
                  color="secondary"
                  onClick={finalTokenUri}
                >
                  tokenUri: {tokenURI}
                </LoadingButton>
              )}
            </Box>

            <br />
            <div id="myImg">
              <button onClick={handleIpfsUpload}>file</button>
            </div>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
