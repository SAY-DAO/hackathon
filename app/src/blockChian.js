import { ethers } from 'ethers';

export async function connectMetaMaskWallet() {
  try {
    window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    return { signerAddress, signer, chainId };
  } catch (e) {
    throw new Error('🦊 Connect to Metamask using the top right button.');
  }
}

