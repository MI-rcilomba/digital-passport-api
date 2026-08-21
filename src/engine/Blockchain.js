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
}

export default Blockchain;
