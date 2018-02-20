const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = Date.now().toString();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now().toString(), { "info": "Genesis block"}, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const newBlock = this.generateNewBlock(data);
        this.chain.push(newBlock);
    }

    generateNewBlock(data) {
        const latestBlock = this.getLatestBlock();
        let newBlock = new Block(
            latestBlock.index + 1,
            Date.now().toString(),
            data,
            latestBlock.hash
        );
        newBlock.hash = newBlock.calculateHash();
        return newBlock;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let blockchain = new Blockchain();
blockchain.addBlock({ amount: 4 });
blockchain.addBlock({ amount: 8 });

console.log(JSON.stringify(blockchain, null, 2));

// Check if chain is valid (will return true)
console.log('Blockchain valid? ' + blockchain.isChainValid());

// Let's now manipulate the data
blockchain.chain[1].data = { amount: 100 };

// Check our chain again (will now return false)
console.log("Blockchain valid? " + blockchain.isChainValid());
