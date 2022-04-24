import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json';
import { base64ToBuffer, bufferOnMonolith } from './imageManager';
import Const from '../models/constants';

const provider = new ethers.providers.InfuraProvider('rinkeby');
const iface = new Interface(contractABI);
const contractAddress = '0xe2aBFe6c4b360aF197AD421FCFC69A6fbF5C4598';
// const contractAddress = '0x2a1068d93BF2aD8a2b93b6DF8a6B607B3A648570';
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
    console.log("Minting: ", res.position, res.ymax, res.nbPix, res.imgURI);
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
    let metadata =  await contract.getMonolithInfo();
    console.log(metadata);
    return  { nbKlon: metadata[2].toNumber(), threshold: metadata[1].toNumber(), nbChunks: metadata[0].toNumber() };
}

async function initialChunkImport() {
    let startSupply = performance.now();
    let meta = await getMetaData();
    console.log(`//     Metadata gotten: ${meta.nbChunks} chunks     //`);
    const monolithHeightFormula = Const.COLUMNS * 64 + (meta.nbKlon * meta.threshold) / 1000000;
    const monolithHeight = Math.floor(monolithHeightFormula / Const.COLUMNS);
    Const.setMonolithHeight(monolithHeight);

    // async function allChunks() {
    for (let i = 1; i <= meta.nbChunks; i++) {
        getChunk(i).then((res) => {
            bufferOnMonolith({
                buffer: base64ToBuffer(res[3]),
                x: res[0].toNumber() % Const.MONOLITH_COLUMNS,
                y: Math.floor(res[0].toNumber() / Const.MONOLITH_COLUMNS),
                paid: res[2].toNumber(),
                yMaxLegal: res[1].toNumber() * 4,
                zIndex: i,
            }); // yMaxLegal à vérifier
        });
        // console.log(`Chunk ${i} imported`);
    }
    // }
    // allChunks();

    async function method2() {
        const promises = [];
        const startTime = new Date();
        console.log('start 2:', startTime);

        for (const item in data) {
            const promise = new Promise((resolve) => {
                setTimeout(() => {
                    if (item % 3 === 0) {
                        resolve({});
                    } else {
                        resolve(item);
                    }
                }, 1);
            });

            promises.push(promise);
        }

        await Promise.all(promises);
    }

    console.log('//      Chunks loaded in', Math.floor(performance.now() - startSupply), 'ms      //');
}

export { chunkCreator, getChunk, getChunksFromPosition, initialChunkImport };
