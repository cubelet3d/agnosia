const explorerUri = 'https://goerli.etherscan.io/tx/';

/**
 * Sends a blockchain transaction using Web3.js.
 * 
 * @param {Object} txData - The transaction data, typically a contract method call.
 * @param {string} value - The amount of Ether to send, in wei.
 * @param {function} onTransactionHash - Callback when the transaction hash is received.
 * @param {function} onReceipt - Callback when the transaction receipt is received.
 */
async function sendTransaction(txData, value, onTransactionHash, onReceipt) {
    try {
        // Fetch private key from local storage and determine the sender's address.
        const privateKey = localStorage.getItem('privateKey');
        const fromAddress = usePrivateKey ? web3.eth.accounts.privateKeyToAccount(privateKey).address : accounts[0];

        // Prepare transaction with estimated gas and price.
        const { gasLimit, gasPrice } = await prepareTransaction(fromAddress, txData.encodeABI(), value, txData._parent._address);

        // Transaction options including gas limit and price.
        const txOptions = {
            from: fromAddress,
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(gasLimit),
            value: value,
			// Include nonce only if using private key
			...(usePrivateKey && { nonce: web3.utils.toHex(currentNonce) }) // This is fetched in conn.js 
        };

        if (usePrivateKey) {
            // If using private key, sign and send the transaction.
            const tx = { ...txOptions, to: txData._parent._address, data: txData.encodeABI() };
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on('transactionHash', hash => {
                    onTransactionHash(hash);
                    currentNonce++; // Increment nonce after transaction is sent
                })
                .on('receipt', onReceipt)
                .on('error', console.error);
        } else {
            // Otherwise, send the transaction directly.
            txData.send(txOptions)
                .on('transactionHash', onTransactionHash)
                .on('receipt', onReceipt)
                .on('error', console.error);
        }
    } catch (e) {
        console.error(e);
    }
}

// Callback for transaction hash
function onTransactionHash(hash) {
	notify(`Sending <a href="${explorerUri}${hash}" target="_blank">transaction</a>. Please wait...`);
    console.log("Transaction Hash:", hash);
}

// Callback for transaction receipt
function onReceipt(receipt) {
	notify(`Success! Your <a href="${explorerUri}${receipt.transactionHash}" target="_blank">transaction</a> has been confirmed.`);
    console.log("Transaction Receipt:", receipt);
}

/**
 * Prepares transaction parameters, estimating gas limit and setting gas price.
 * 
 * @param {string} player - The address initiating the transaction.
 * @param {string} data - Encoded transaction data.
 * @param {string} value - The amount of Ether to send, in wei.
 * @param {string} receiver - The receiving address of the transaction.
 * @returns {Object} An object containing the gasLimit and gasPrice.
 */
async function prepareTransaction(player, data, value, receiver) {
    // Create a transaction object for gas estimation.
    const txForEstimation = { from: player, to: receiver, data, value };

    // Estimate gas and add a 10% buffer.
    const estimatedGas = await web3.eth.estimateGas(txForEstimation);
    const bufferBN = web3.utils.toBN(estimatedGas).div(web3.utils.toBN(10));
    const gasWithBufferBN = web3.utils.toBN(estimatedGas).add(bufferBN).toString();

    // Retrieve the current gas price and double it to expedite the transaction.
    const normalGasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = web3.utils.toBN(normalGasPrice).mul(web3.utils.toBN(2));

    // Return the calculated gas limit and price.
    return { gasLimit: gasWithBufferBN, gasPrice: increasedGasPrice };
}
