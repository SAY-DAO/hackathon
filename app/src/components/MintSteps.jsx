import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import { Grid } from "@mui/material";

export default function MintSteps({
  needs,
  onMarketDeploy,
  onMainFactoryDeploy,
  marketAddress,
  mainFactoryAddress,
  onLazyFactoryDeploy,
  lazyAddress,
  onSign,
  userOneAddress,
  voucher,
  onMint,
  userTwoAddress,
  inputValue,
  isLoading,
  isDisabled,
}) {
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
                  href={`https://goerli.etherscan.io/address/${marketAddress}`}
                >
                  {marketAddress}
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
              disabled={marketAddress}
              loading={isLoading}
              variant="contained"
              onClick={onMarketDeploy}
            >
              1-Deploy SAY Market
            </LoadingButton>
            <LoadingButton
              loading={isLoading}
              disabled={!marketAddress || mainFactoryAddress}
              sx={{ margin: 2 }}
              variant="contained"
              onClick={onMainFactoryDeploy}
            >
              2 -Deploy SAY Main Factory
            </LoadingButton>

            <div style={{ margin: 30 }}>
              <p>
                Treasury Balance: <span>{}</span>
              </p>
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
            <p>
              Wallet: <span>{userOneAddress}</span>
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
          <h4>User 1: Take care of the need and sign</h4>
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
            <h4>User 2: Mint two NFTS (Liberty, Impact)</h4>
            <p>
              Account 2: <span>{userTwoAddress}</span>
            </p>
            <p>Minted Signature:{inputValue}</p>
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
