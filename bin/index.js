#!/usr/bin/env node

const csv = require('csv-parser');
const fs = require('fs');
const { ethers } = require("ethers");
const yargs = require("yargs");
require('dotenv').config()

const api = process.env.API_KEY;
const provider = new ethers.providers.EtherscanProvider("rinkeby", api);

/*const options = yargs
 .usage("Usage: -f <from> -t <to> -a <amount>  (Wallets IDs must be written in this format: #1, #2)")
 .option("f", { alias: "from", describe: "ID of the source for the transfer", type: "string", demandOption: true })
 .option("t", { alias: "to", describe: "ID of the recipient for the transfer", type: "string", demandOption: true })
 .option("a", { alias: "amount", describe: "Amount of Eth to be transfered", type: "string", demandOption: true })
 .argv;*/

//var fromID = options.from.split('#')[1];
//var toID = options.to.split('#')[1];


let importWallets = () => {
  let Wallets = [];
  fs.createReadStream('Wallets.csv')
    .pipe(csv())
    .on('data', (row) => {
      Wallets.push(row);
    })
    .on("end", () => {
      console.log('finished');
    })
}

var Wallets = importWallets();

var signingWallet = new ethers.Wallet(/*Wallets[fromID].PrivateKey*/"0x57aa4ab356f829d7ff36cfe76cde84787d1a314d26b5fca3eb34b80c08e83d9e", provider);
var tx = {
  to: /*Wallets[toID].Address*/"0x58D9f3d384e8dD0B88452450A549C0d1A7b78Eb8",
  value: ethers.utils.parseEther(/*options.amount*/"1")
}

let transaction = async () => {
  try{
    let trx = await signingWallet.sendTransaction(tx);
    console.log(trx.hash);
  }catch(error){
    console.log(error);
  }
}