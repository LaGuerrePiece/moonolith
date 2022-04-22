import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json';
import { base64ToBuffer, bufferOnMonolith } from './imageManager';
import Const from '../models/constants';

const provider = new ethers.providers.InfuraProvider('rinkeby');
const iface = new Interface(contractABI);
const contractAddress = '0x2E47CBDe82b8765055a73e6AC914e22a75b8b961';
// const contractAddress = '0x2a1068d93BF2aD8a2b93b6DF8a6B607B3A648570';
const contract = new ethers.Contract(contractAddress, contractABI, provider);

const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
if (window.ethereum) {
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
