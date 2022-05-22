import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json';
import { displayShareScreen } from '../display/GUI';
import { chunkImport, importedChunks } from '../main';

const provider = new ethers.providers.InfuraProvider('rinkeby');
const iface = new Interface(contractABI);
const contractAddress = '0x24d1fEA9115602779E6112aA40520640aDF35062';
// const contractAddress = '0xde02A804Dd2eFe93F353ea7365A9972513B9ae2E'; //CONTRAT VIERGE
// const contractAddress = '0xB1F21b3799DA0eEC6765cBF38f0c7278a0EaF51E'; //CONTRAT VIERGE
// const contractAddress = '0x1593f13eC77e01Ec93B8c51846613Fe567b2258a'; //CONTRAT VIERGE AVEC PLUS DE PLACE
const contract = new ethers.Contract(contractAddress, contractABI, provider);
let metamaskProvider;
var metamaskContract;

let sentChunk;

if (window.ethereum) {
    metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = metamaskProvider.getSigner();
    metamaskContract = new ethers.Contract(contractAddress, contractABI, signer);
}

export const chunkCreator = async (res) => {
    if (window.ethereum.chainId == '0x4') {
        await metamaskProvider.send('eth_requestAccounts', []);
        let p = await getPrice()
        let overrides = {
            value: p.mul(res.nbPix),
        };
        console.log(p.mul(res.nbPix).toNumber())
        // console.log('Minting: ', res.position, res.ymax, res.nbPix, res.imgURI);
        let tx = metamaskContract.draw2438054C(res.position, res.ymax, res.nbPix, res.imgURI, overrides);
        tx.then((tx) => {
            tx.wait().then(() => {
                chunkImport(false);
                getMetaData().then((meta) => {
                    sentChunk = meta.nbChunks;
                    setTimeout(() => {
                        displayShareScreen();
                    }, 3000);
                });
            });
        });
    } else {
        alert("Mets le testnet l'ami");
    }
};

/**
 * Demande les données d'un chunk
 * @param {numero du dessin} id
 * @returns {position, ymax, nbPix, string de l'image}
 */
export const getChunk = async (id) => {
    let data = await contract.queryFilter(contract.filters.Chunk(id));
    let topics = data[0].topics;
    data = data[0].data;
    let res = iface.parseLog({ data, topics }).args;
    res = res.slice(1);
    return res;
};

export const getChunksFromPosition = async (min, max) => {
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
    //console.log(res);
    return res;
};

async function getPrice() {
    let price = await contract._pricePerPix();
    return price;
}

export async function getMetaData() {
    let metadata = await contract.getMonolithInfo();
    return { nbKlon: metadata[2].toNumber(), threshold: metadata[1].toNumber(), nbChunks: metadata[0].toNumber() };
}

export function openLink(type) {
    if (type === 'opensea') {
        window.open('https://testnets.opensea.io/assets/' + contractAddress + '/' + sentChunk, '_blank');
    } else if (type === 'twitter') {
        window.open(
            'https://twitter.com/intent/tweet?text=My%20rune%20%3A&url=beta.moonolith.io/rune=' + sentChunk,
            '_blank'
        );
    }
}

export function getBrowserLocales(options = {}) {
    const defaultOptions = {
        languageCodeOnly: false,
    };
    const opt = {
        ...defaultOptions,
        ...options,
    };
    const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages;
    if (!browserLocales) {
        return undefined;
    }
    return browserLocales.map((locale) => {
        const trimmedLocale = locale.trim();
        return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
    });
}

export function isMetamaskHere() {
    if (window.ethereum) return true;
    else return false;
}
