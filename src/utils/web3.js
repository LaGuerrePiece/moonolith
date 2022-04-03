import { ethers } from 'ethers';
import contractABI from '../utils/abi.json'

const provider = new ethers.providers.Web3Provider(window.ethereum) //|| 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');

const signer = provider.getSigner();

const contractAddress = '0xF8E3b3eFee9f7A9d8D03a82eeB5f76AFF55a7875';

const contract = new ethers.Contract(contractAddress, contractABI, signer);

const getSupply = async () => {
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

/**
 * Demande les données d'un chunk
 * @param {numero du dessin} id 
 * @returns {position, ymax, nbPix, string de l'image}
 *  IL NOUS FAUDRAIT AUSSI PIXEL PAID, EST-CE NBPIX ????
 */
const getChunk = async (id) => {                                    
    await provider.send('eth_requestAccounts', []);
    // console.log('signer :', signer)
    return await contract.chunks(id);
};

const getTotalPixs = async () => {
    await provider.send('eth_requestAccounts', []);
    // console.log('signer :', signer)
    return await contract.totalPixs();
};

export { chunkCreator, getChunk, getSupply, getTotalPixs };
