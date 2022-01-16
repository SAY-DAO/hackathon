import { create as ipfsClient } from 'ipfs-http-client';

const client = ipfsClient(`${process.env.REACT_APP_IPFS}:5001/api/v0`);

export default client;