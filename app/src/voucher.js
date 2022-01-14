// Mst match the smart contract constants.
const SIGNING_DOMAIN_NAME = "SAY";
const SIGNING_DOMAIN_VERSION = "1";

class Voucher {
  constructor({ contract, signer }) {
    this.contract = contract;
    this.signer = signer;
  }

  // design your domain separator
  async designDomain() {
    if (this.domainData != null) {
      return this.domainData;
    }
    const chainId = await this.contract.getChainID();

    this.domainData = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    };

    return this.domainData;
  }

  async signTransaction(
    needId,
    totalInWei,
    totalInDollar,
    firstName,
    tokenUri
  ) {
    const domain = await this.designDomain();
    // define your data types
    const types = {
      Voucher: [
        { name: "needId", type: "uint256" },
        { name: "priceWei", type: "uint256" },
        { name: "priceDollar", type: "string" },
        { name: "tokenUri", type: "string" },
        { name: "content", type: "string" },
      ],
    };

    const voucher = {
      needId: parseInt(needId),
      priceWei: totalInWei,
      priceDollar: totalInDollar,
      tokenUri,
      content: `Hey, You are signing this done need to be minted!`,
    };

    // signer._signTypedData(domain, types, value) =>  returns a raw signature
    const signature = await this.signer._signTypedData(domain, types, voucher);

    return {
      ...voucher,
      signature,
    };
  }
}

module.exports = {
  Voucher,
};
