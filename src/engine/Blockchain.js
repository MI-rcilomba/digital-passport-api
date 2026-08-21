import Block from './Block.js';

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return new Block(0, 1772188800000, [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    if (!this.isTransactionValid(transaction)) {
      throw new Error('Invalid transaction');
    }

    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(difficulty) {
    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      latestBlock.index + 1,
      Date.now(),
      this.pendingTransactions,
      latestBlock.hash,
    );

    newBlock.mineBlock(difficulty);

    this.chain.push(newBlock);
    this.pendingTransactions = [];

    return newBlock;
  }

  isTransactionValid(transaction) {
    const currentOwner = this.getCurrentOwner(transaction.serialNumber);

    if (!currentOwner) {
      return transaction.fromAddress === '0xManufacturerKey';
    }

    return transaction.fromAddress === currentOwner;
  }

  getCurrentOwner(serialNumber) {
    const transactions = [
      ...this.chain.flatMap((block) => block.data),
      ...this.pendingTransactions,
    ];

    const productTransactions = transactions.filter(
      (transaction) => transaction.serialNumber === serialNumber,
    );

    if (productTransactions.length === 0) {
      return null;
    }

    return productTransactions[productTransactions.length - 1].toAddress;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i += 1) {
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

export default Blockchain;
