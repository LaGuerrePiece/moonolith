import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json';
import { base64ToBuffer, bufferOnMonolith } from './imageManager';
import Const from '../models/constants';

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

const getChunksFromPosition = async (min, max) => {
    let res = [];
    for (let i = min; i <= max; i++) {
        let data = await contract.queryFilter(contract.filters.Chunk(null, i));
        if (data.length > 0) {
            let topics = data[0].topics;
            data = data[0].data;
            let chunk = iface.parseLog({ data, topics }).args;
            console.log(chunk);
            chunk = chunk.slice(1);
            res.push(chunk);
        }
    }
    console.log(res);
    return res;
};

const getThreshold = async () => {
    return await contract.threshold();
};

const getTotalPixs = async () => {
    return await contract.klonSum();
};

async function importChunks() {
    let startSupply = performance.now();
    await getSupply()
        .then(async (supply) => {
            let klonSum = supply.toNumber();
            // const offsetFormule = Const.COLUMNS * 64;
            // getThreshold().then(async (threshold) => {
            //     const formuleDeLaMort = offsetFormule + (klonSum * threshold) / 1000000;
            //     const nbLine = Math.floor(formuleDeLaMort / nbColonne);
            //     console.log(`nbLine : ${nbLine}, nbColonne : ${nbColonne}`);
            // });
            for (let i = 1; i <= klonSum; i++) {
                getChunk(i).then((res) => {
                    let pixelPaid = res[2].toNumber();
                    let index = res[0].toNumber();
                    let yMaxLegal = res[1].toNumber() * 4;
                    let x = index % Const.MONOLITH_COLUMNS;
                    let y = Math.floor(index / Const.MONOLITH_COLUMNS);
                    // console.log('x y', x, y, 'yMaxLegal', yMaxLegal, 'pixelPaid', pixelPaid);
                    let arrBuffer = base64ToBuffer(res[3]);
                    bufferOnMonolith(arrBuffer, x, y, pixelPaid, yMaxLegal, i); // yMaxLegal à vérifier
                });
            }
        })
        .finally(() => {
            console.log('Chunks loaded in ' + (performance.now() - startSupply) + ' ms');
        });
}

export { chunkCreator, getChunk, getChunksFromPosition, getSupply, importChunks, getThreshold };
