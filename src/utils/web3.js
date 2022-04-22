import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json';
import { base64ToBuffer, bufferOnMonolith } from './imageManager';
import Const from '../models/constants';

const provider = new ethers.providers.InfuraProvider('rinkeby');
const iface = new Interface(contractABI);
const contractAddress = '0x304e3a37092Cf9C42fd41Cb60c76961B4950f050';
//const contractAddressCaly = '0x2a1068d93BF2aD8a2b93b6DF8a6B607B3A648570';
const contract = new ethers.Contract(contractAddress, contractABI, provider);

if (window.ethereum) {
    const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = metamaskProvider.getSigner();
    var metamaskContract = new ethers.Contract(contractAddress, contractABI, signer);
}

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

async function getMetaData() {
    let [nbKlon, threshold, nbChunks] = await Promise.all([
        contract.klonSum(),
        contract.threshold(),
        contract.totalSupply(),
    ]);
    return await { nbKlon: nbKlon.toNumber(), threshold: threshold.toNumber(), nbChunks: nbChunks.toNumber() };
}

async function initialChunkImport() {
    let startSupply = performance.now();
    await getMetaData()
        .then((meta) => {
            const monolithHeightFormula = Const.COLUMNS * 64 + (meta.nbKlon * meta.threshold) / 1000000;
            const monolithHeight = Math.floor(monolithHeightFormula / Const.COLUMNS);
            Const.setMonolithHeight(monolithHeight);
            for (let i = 1; i <= meta.nbChunks; i++) {
                getChunk(i).then((res) => {
                    let index = res[0].toNumber();
                    let yMaxLegal = res[1].toNumber() * 4;
                    let pixelPaid = res[2].toNumber();
                    let x = index % Const.MONOLITH_COLUMNS;
                    let y = Math.floor(index / Const.MONOLITH_COLUMNS);
                    let arrBuffer = base64ToBuffer(res[3]);
                    bufferOnMonolith({
                        buffer: arrBuffer,
                        x: x,
                        y: y,
                        paid: pixelPaid,
                        yMaxLegal: yMaxLegal,
                        zIndex: i,
                    }); // yMaxLegal à vérifier
                });
            }
        })
        .then(() => {
            console.log('Chunks loaded in ' + (performance.now() - startSupply) + ' ms');
        });
}

export { chunkCreator, getChunk, getChunksFromPosition, initialChunkImport };
