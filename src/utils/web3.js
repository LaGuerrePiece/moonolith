import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json'

const provider = new ethers.providers.InfuraProvider('rinkeby');
const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum)
const iface = new Interface(contractABI);
const contractAddress = '0x22968DBDD0469d5b4513dAbd9b4F23b8CB5d2270';

var metamaskContract;
const contract = new ethers.Contract(contractAddress, contractABI, provider);
if(window.ethereum){
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
        value: oneGwei.mul(res.nbPix).mul(100000),
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
    let res = iface.parseLog({data, topics}).args;
    res = res.slice(1);
    return res;                   
};

const getTotalPixs = async () => {
    return await contract.klonSum();
};

export { chunkCreator, getChunk, getSupply, getTotalPixs };
