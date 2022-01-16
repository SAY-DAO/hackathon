import { create as ipfsClient } from 'ipfs-http-client';

const client = ipfsClient(`https://ipfs.infura.io:5001/api/v0`);

export default client;