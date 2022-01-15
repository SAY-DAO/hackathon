import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
            <button onClick={onMarketDeploy}>Deploy SAY Market</button>
            <button onClick={onMainFactoryDeploy}>
              Deploy SAY Main Factory
            </button>

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
            <button onClick={onLazyFactoryDeploy}>Deploy Lazy Factory</button>

            <div style={{ margin: 30 }}>
              <p>
                address:{" "}
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
