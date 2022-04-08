import { ethers } from 'ethers';
import contractABIOld from '../utils/abi.json'
import contractABI from '../utils/abi2.json'

const provider = new ethers.providers.InfuraProvider('rinkeby');
const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum)

const contractAddressOld = '0x22968DBDD0469d5b4513dAbd9b4F23b8CB5d2270';
const contractAddress = '0x68c1B2ddd4A84D570ee7A84dc21bB1E354e88E6D';

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
    return await contract.chunks(id);
};

const getTotalPixs = async () => {
    return await contract.totalPixs();
};

export { chunkCreator, getChunk, getSupply, getTotalPixs };
