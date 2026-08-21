import Block from './Block.js';

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, 1772188800000, [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

export default Blockchain;
