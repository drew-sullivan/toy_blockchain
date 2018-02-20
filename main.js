const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(timestamp, transactions, previousHash) {
        this.timestamp = Date.now().toString();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
}

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    mineBlock(block, difficulty) {
        while (block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            block.nonce++;
            block.hash = block.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }

    createGenesisBlock() {
        return new Block({ "info": "Genesis block"}, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(transactions) {
        const newBlock = this.generateNewBlock(transactions);
        console.log(JSON.stringify(newBlock, null, 4));
        this.chain.push(newBlock);
    }

    generateNewBlock(transactions) {
        const latestBlock = this.getLatestBlock();
        let newBlock = new Block(
            Date.now().toString(),
            transactions,
            latestBlock.hash
        );
        newBlock.hash = newBlock.calculateHash();
        blockchain.mineBlock(this.difficulty);
        return newBlock;
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now().toString(), this.pendingTransactions, this.getLatestBlock().hash);
        blockchain.mineBlock(block, this.difficulty);
        this.chain.push(block);
        //Reset pendingTransactions and send out mining reward
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    getBalanceByAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) return false;

            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

let blockchain = new Blockchain();

blockchain.addTransaction(new Transaction('address_1', 'address_2', 10));
blockchain.addTransaction(new Transaction('address_1', 'address_2', 5));
console.log('Starting mining...');
blockchain.minePendingTransactions('Drew\'s_address');
console.log(`Balance of Drew\'s address: ${blockchain.getBalanceByAddress('Drew\'s_address')}`);
console.log('Starting the miner again!');
blockchain.minePendingTransactions('Drew\'s_address');
console.log(`Balance of Drew\'s address: ${blockchain.getBalanceByAddress('Drew\'s_address')}`);

// console.log(JSON.stringify(blockchain, null, 2));
