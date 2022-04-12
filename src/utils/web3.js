import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json';

const provider = new ethers.providers.InfuraProvider('rinkeby');
const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
const iface = new Interface(contractABI);
const contractAddress = '0x304e3a37092Cf9C42fd41Cb60c76961B4950f050';
//const contractAddressCaly = '0x2a1068d93BF2aD8a2b93b6DF8a6B607B3A648570';

var metamaskContract;
const contract = new ethers.Contract(contractAddress, contractABI, provider);
if (window.ethereum) {
    const signer = metamaskProvider.getSigner();
    metamaskContract = new ethers.Contract(contractAddress, contractABI, signer);
}

const getSupply = async () => {
    return await contract.totalSupply();
};

const chunkCreator = async (res) => {
    await metamaskProvider.send('eth_requestAccounts', []);
    const oneGwei = ethers.BigNumber.from('1000000000');
    let overrides = {
        value: oneGwei.mul(res.nbPix),
    };
    let tx = metamaskContract.mint_One_4d(res.position, res.ymax, res.nbPix, res.imgURI, overrides);
};

/**
 * Demande les données d'un chunk
 * @param {numero du dessin} id
 * @returns {position, ymax, nbPix, string de l'image}
 */
const getChunk = async (id) => {
    let data = await contract.queryFilter(contract.filters.Chunk(id));
    let topics = data[0].topics;
    data = data[0].data;
    let res = iface.parseLog({ data, topics }).args;
    res = res.slice(1);
    return res;
};

const getTotalPixs = async () => {
    return await contract.klonSum();
};

const getThreshold = async () => {
    return await contract.threshold();
};

export { chunkCreator, getChunk, getSupply, getTotalPixs, getThreshold };
