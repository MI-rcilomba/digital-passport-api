import crypto from 'node:crypto';

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const blockContent = JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      previousHash: this.previousHash,
      nonce: this.nonce,
    });

    return crypto.createHash('sha256').update(blockContent).digest('hex');
  }

  mineBlock(difficulty) {
    const requiredPrefix = '0'.repeat(difficulty);

    while (!this.hash.startsWith(requiredPrefix)) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
  }
}

export default Block;
