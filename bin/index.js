#!/usr/bin/env node

const csv = require('csv-parser');
const fs = require('fs');
const { ethers } = require("ethers");
const yargs = require("yargs");
require('dotenv').config()

const KEY = process.env.API_KEY;
const provider = new ethers.providers.EtherscanProvider("rinkeby", KEY);

const options = yargs
 .usage("Usage: -f <from> -t <to> -a <amount>  (Wallets IDs must be written in this format: #1, #2). CSV file must be named 'Wallets.csv'")
 .option("f", { alias: "from", describe: "ID of the source for the transfer", type: "string", demandOption: true })
 .option("t", { alias: "to", describe: "ID of the recipient for the transfer", type: "string", demandOption: true })
 .option("a", { alias: "amount", describe: "Amount of Eth to be transfered", type: "string", demandOption: true })
 .argv;

var fromID = options.from.split('#')[1] - 1;
var toID = options.to.split('#')[1] - 1;

var Wallets = []
var signingWallet;
var tx;


let importWallets = () => {
  fs.createReadStream('Wallets.csv')
    .pipe(csv())
    .on('data', (row) => {
      Wallets.push(row);
    })
    .on("end", () => {
      console.log('finished');
    })
}

let app = () => {
  signingWallet = new ethers.Wallet(Wallets[fromID].PrivateKey, provider);
  let address = Wallets[toID].Address;
  tx = {
    to: address,
    value: ethers.utils.parseEther(options.amount)
  }
}

let transaction = async () => {
  try{
    let trx = await signingWallet.sendTransaction(tx);
    console.log(trx.hash);
  }catch(error){
    console.log(error);
  }
}

importWallets()
setTimeout(() => {
  app();
  transaction()
}, 1000);