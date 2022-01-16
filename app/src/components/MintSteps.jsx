import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import { Grid } from "@mui/material";
import { fetchTreasuryBalance } from "../blockChian";

export default function MintSteps({
  needs,
  onTreasuryDeploy,
  onMainFactoryDeploy,
  treasuryAddress,
  mainFactoryAddress,
  onLazyFactoryDeploy,
  lazyAddress,
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

  const balanceHandler = async () => {
    setIsLoading(true);
    const theBalance = await fetchTreasuryBalance(treasuryAddress);
    setBalance(theBalance);
    setIsLoading(false);
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
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid>
            <LoadingButton
              disabled={treasuryAddress}
              loading={isLoading}
              variant="contained"
              onClick={onTreasuryDeploy}
            >
              1-Deploy SAY Treasury
            </LoadingButton>
            <LoadingButton
              loading={isLoading}
              disabled={!treasuryAddress || mainFactoryAddress}
              sx={{ margin: 2 }}
              variant="contained"
              onClick={onMainFactoryDeploy}
            >
              2 -Deploy SAY Main Factory
            </LoadingButton>
            <div>
              <p>
                Treasury Balance: <span>{balance} ether</span>
              </p>
              <LoadingButton
                onClick={balanceHandler}
                disabled={!treasuryAddress}
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
                disabled={!mainFactoryAddress || lazyAddress}
                variant="contained"
                onClick={onLazyFactoryDeploy}
              >
                Deploy Lazy Factory
              </LoadingButton>
            </div>

            <div>
              <div style={{ margin: 30 }}>
                <LoadingButton
                  disabled={!lazyAddress}
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
                  disabled={!lazyAddress}
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
              disabled={!voucher}
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
            <LoadingButton variant="contained" onClick={onMint}>
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
              Account 3: <span>{userTwoAddress}</span>
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid style={{ margin: 30 }}>
            <LoadingButton
              disabled={!voucher}
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
            <LoadingButton variant="contained" onClick={onMint}>
              Mint The Signature
            </LoadingButton>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
