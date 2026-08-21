import test from 'node:test';
import assert from 'node:assert/strict';
import Blockchain from '../src/engine/Blockchain.js';

test('creates a blockchain with a genesis block', () => {
  const blockchain = new Blockchain();

  assert.equal(blockchain.chain.length, 1);
  assert.equal(blockchain.chain[0].index, 0);
  assert.equal(blockchain.chain[0].previousHash, '0');
});

test('returns the latest block', () => {
  const blockchain = new Blockchain();

  const latestBlock = blockchain.getLatestBlock();

  assert.equal(latestBlock, blockchain.chain[0]);
});

test('starts with no pending transactions', () => {
  const blockchain = new Blockchain();

  assert.deepEqual(blockchain.pendingTransactions, []);
});

test('adds a transaction to pending transactions', () => {
  const blockchain = new Blockchain();
  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };

  blockchain.addTransaction(transaction);

  assert.deepEqual(blockchain.pendingTransactions, [transaction]);
});
