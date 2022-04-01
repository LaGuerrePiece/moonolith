import { ethers } from 'ethers';
import contractABI from '../utils/abi.json'

const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();

const contractAddress = '0xc5Db83C04BFb3c7e842f45950C75E156fa6383a7';

const contract = new ethers.Contract(contractAddress, contractABI, signer);

const getSupply = async (id) => {
    await provider.send('eth_requestAccounts', []);
    // console.log('signer :', signer)
    return await contract.totalSupply();
};

const chunkCreator = async (res) => {
    await provider.send('eth_requestAccounts', []);
    // console.log('signer :', signer)
    // console.log(await contract.chunks(1))
    const oneGwei = ethers.BigNumber.from('1000000000');
    // console.log(ethers.utils.formatUnits(oneGwei, 0))
    let overrides = {
        value: oneGwei.mul(res.nbPix).mul(100000),
    };
    let tx = contract.mint_One_4d(res.position, res.ymax, res.nbPix, res.imgURI, overrides);
};

const getChunk = async (id) => {
    await provider.send('eth_requestAccounts', []);
    // console.log('signer :', signer)
    return await contract.chunks(id);
};

const getTotalPix = async (id) => {
    await provider.send('eth_requestAccounts', []);
    // console.log('signer :', signer)
    return await contract.totalPixs();
};

export { chunkCreator, getChunk, getSupply, getTotalPix };
