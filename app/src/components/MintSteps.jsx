import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";

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
}) {
  const [isDisabled, setIsDisabled] = useState(false);

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
          <Typography>SAY Smart Contracts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <LoadingButton variant="contained" onClick={onMarketDeploy}>
              1-Deploy SAY Market
            </LoadingButton>
            <LoadingButton
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
              <p>
                market address:{" "}
                <span>
                  <a
                    href={`https://goerli.etherscan.io/address/${marketAddress}`}
                  >
                    {marketAddress}
                  </a>
                </span>
              </p>
              <p>
                main address:{" "}
                <span>
                  <a
                    href={`https://goerli.etherscan.io/address/${mainFactoryAddress}`}
                  >
                    {mainFactoryAddress}
                  </a>
                </span>
              </p>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>User 1: Take care of the need and sign</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <LoadingButton variant="contained" onClick={onLazyFactoryDeploy}>
              Deploy Lazy Factory
            </LoadingButton>

            <div style={{ margin: 30 }}>
              <p>
                address:
                <span>
                  <a
                    href={`https://goerli.etherscan.io/address/${lazyAddress}`}
                  >
                    {lazyAddress}
                  </a>
                </span>
              </p>
            </div>
            <div>
              <div style={{ margin: 30 }}>
                <LoadingButton
                  variant="contained"
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
                </LoadingButton>
          
                <div className="content">
                  <pre style={{ maxWidth: "100%", overflow: "scroll" }}>
                    {JSON.stringify(needs, 0, 2)}
                  </pre>
                </div>
                <img src={needs[0].imageUrl} alt="icon" width={50} />
                <img src={needs[0].child.avatarUrl} alt="icon" width={50} />
              </div>
              <div style={{ margin: 30 }}>
                <LoadingButton variant="contained" onClick={onSign}>
                  Sign The Done Need
                </LoadingButton>
                <p>
                  Account 1: <span>{userOneAddress}</span>
                </p>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled={isDisabled}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>User 2: Mint two NFTS (Liberty, Impact)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ margin: 30 }}>
            <LoadingButton
              variant="contained"
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
            </LoadingButton>
            <div className="content">
              <pre style={{ maxWidth: "100%", overflow: "scroll" }}>
                {voucher && voucher.signature && JSON.stringify(voucher, 0, 2)}
              </pre>
            </div>
            <LoadingButton variant="contained" onClick={onMint}>
              Mint The Signature
            </LoadingButton>
            <p>
              Account 2: <span>{userTwoAddress}</span>
            </p>
            <p>Minted Signature:{inputValue}</p>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
