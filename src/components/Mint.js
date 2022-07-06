import React from "react"
import logo from '../images/logo.png';
import opensea from '../images/opensea.png';
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import rent from '../utils/RentMyApartment.json';

const CONTRACT_ADDRESS = "0x8745Fa91ad61811cc27646754275Aa10920240D5";

function toTimestamp(strDate) { var datum = Date.parse(strDate); return datum / 1000; }

function Mint() {

    const [currentAccount, setCurrentAccount] = useState("");
    const [start, setStart] = React.useState('');
    const [end, setEnd] = React.useState('');

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);

            let chainId = await ethereum.request({ method: 'eth_chainId' });
            console.log("Connected to chain " + chainId);

            // String, hex code of the chainId of the Rinkebey test network
            const rinkebyChainId = "0x4";
            if (chainId !== rinkebyChainId) {
                alert("You are not connected to the Rinkeby Test Network!");
            }

            setupEventListener()
        } else {
            console.log("No authorized account found")
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);

            setupEventListener()
        } catch (error) {
            console.log(error)
        }
    }

    const setupEventListener = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, rent.abi, signer);

                connectedContract.on("NewNFTMinted", (from, tokenId) => {
                    console.log(from, tokenId.toNumber())
                    console.log("Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/"+CONTRACT_ADDRESS+"/"+tokenId.toNumber())
                });

                console.log("Setup event listener!")

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, rent.abi, signer);

                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await connectedContract.rent(toTimestamp(start), toTimestamp(end));

                console.log("Mining...please wait.")
                await nftTxn.wait();
                console.log(nftTxn);
                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button mint--btn">
            <span className="connect">Connect Wallet</span>
        </button>
    );

    const renderMintUI = () => (
        <button onClick={askContractToMintNft} className="cta-button mint-button mint--btn">
            Mint
        </button>
    )

    return (
        <div className="mintContainer">
            <img className="mint--image" alt="RentMyApartment logo" src={logo} />
            <div className="mint--profile">
                <h1 className="mint--name">RentMyApartment</h1>
                <h3 className="mint--address">Rua de Sá da Bandeira, 363</h3>
                <span className="mint--dates">Start: <input type="date" placeholder="Start" value={start} onChange={event => setStart(event.target.value)} /></span>
                <span className="mint--dates">End: <input type="date" placeholder="End" value={end} onChange={event => setEnd(event.target.value)} /></span>
                <div className="mint--btn">
                    {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
                    <a className="mint--btn mint--opensea" target="_blank" rel="noopener noreferrer" href="https://testnets.opensea.io/collection/rentmyapartment-porto"><img alt="Opensea Logo" className="mint--opensea--logo" src={opensea} /> Collection</a>
                </div>
            </div>
        </div>
    )
}

export default Mint