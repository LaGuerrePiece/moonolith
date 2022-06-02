import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import contractABI from '../utils/abi.json';
import { displayShareScreen } from '../display/GUI';
import { chunkImport } from '../main';
import { decreaseZoom } from '../display/view';

const provider = new ethers.providers.InfuraProvider('mainnet');
//const provider = new ethers.providers.InfuraProvider('rinkeby');
const iface = new Interface(contractABI);
const contractAddress = '0xC3891fc8375901F78fCc2743922B237C960C3147'; // Ethereum Contract
// const contractAddress = '0x59a72E06F7E5b56d53F2C381043C3dEAc4916804';  // Rinkeby Contract
const contract = new ethers.Contract(contractAddress, contractABI, provider);
let metamaskProvider;
let metamaskContract;

let sentChunk;

if (window.ethereum) {
    ethereum.on('chainChanged', handleChainChanged);
    metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    checkChain();
    const signer = metamaskProvider.getSigner();
    metamaskContract = new ethers.Contract(contractAddress, contractABI, signer);
}

export const chunkCreator = async (res) => {
    checkChain();
    await metamaskProvider.send('eth_requestAccounts', []);
    let p = await getPrice();
    let overrides = {
        value: p.mul(res.nbPix),
    };

    let tx = metamaskContract.draw2438054C(res.position, res.ymax, res.nbPix, res.imgURI, overrides);
    tx.then((tx) => {
        console.log('Minting: ', res.position, res.ymax, res.nbPix, res.imgURI);
        tx.wait().then(() => {
            chunkImport(false);
            getMetaData().then((meta) => {
                sentChunk = meta.nbChunks;
                setTimeout(() => {
                    displayShareScreen();
                    decreaseZoom(1);
                }, 3000);
            });
        });
    }).catch((err) => {
        if (err.code == 'INSUFFICIENT_FUNDS' || err.code == -32000) {
            window.alert(
                'Transaction failed \nMake sure you are connected to the ethereum network and have enough eth\n(0.000025 eth per pixel + gas)'
            );
        }
    });
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

export const getAllChunks = async () => {
    let data = await contract.queryFilter(contract.filters.Chunk());
    let allChunks = [];
    data.forEach((d) => {
        let data = d.data;
        let topics = d.topics;
        let chunk = iface.parseLog({ data, topics }).args;
        allChunks.push(chunk);
    });
    return allChunks;
};

export const getChunksFromPosition = async (min, max) => {
    let res = [];
    for (let i = min; i <= max; i++) {
        let data = await contract.queryFilter(contract.filters.Chunk(null, i));
        if (data.length > 0) {
            let topics = data[0].topics;
            data = data[0].data;
            let chunk = iface.parseLog({ data, topics }).args;
            chunk = chunk.slice(1);
            res.push(chunk);
        }
    }
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
        window.open('https://opensea.io/assets/' + contractAddress + '/' + sentChunk, '_blank');
    } else if (type === 'twitter') {
        window.open(
            'https://twitter.com/intent/tweet?text=My%20mark%20on%20the%20moonolith%20%3A&url=moonolith.io/?mark=' +
                sentChunk,
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
    if (!browserLocales) return undefined;
    return browserLocales.map((locale) => {
        const trimmedLocale = locale.trim();
        return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
    });
}

export function isMetamaskHere() {
    if (window.ethereum) return true;
    else return false;
}

function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
}
async function checkChain() {
    const { chainId } = await metamaskProvider.getNetwork();
    if (chainId != 1) {
        window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: '0x1',
                },
            ],
        });
    }
}
