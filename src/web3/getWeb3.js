import Web3 from 'web3';

export default async function getWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        //Ask user permission
        try{
            await window.ethereum.enable();
            console.log(web3.version);
            return web3;
        } catch (err) {
            console.log(err);
        }
    // Legacy dapp browsers...
    } else if (window.web3) {
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        return web3;
    } else {
        console.log("No web3 detected, please consider using Metamask");
    }
}
