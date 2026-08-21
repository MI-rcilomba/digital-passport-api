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

test('rejects a first product transaction if it does not come from the manufacturer', () => {
  const blockchain = new Blockchain();
  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xFakeSeller',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };

  assert.throws(() => blockchain.addTransaction(transaction), {
    message: 'Invalid transaction',
  });
  assert.deepEqual(blockchain.pendingTransactions, []);
});

test('rejects a transfer from someone who is not the current owner', () => {
  const blockchain = new Blockchain();
  const firstTransaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };
  const invalidTransfer = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xFakeSeller',
    toAddress: '0xCollectorB',
    timestamp: 1772275200000,
  };

  blockchain.addTransaction(firstTransaction);

  assert.throws(() => blockchain.addTransaction(invalidTransfer), {
    message: 'Invalid transaction',
  });
  assert.deepEqual(blockchain.pendingTransactions, [firstTransaction]);
});

test('accepts a transfer from the current owner', () => {
  const blockchain = new Blockchain();
  const firstTransaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };
  const validTransfer = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xCollectorA',
    toAddress: '0xCollectorB',
    timestamp: 1772275200000,
  };

  blockchain.addTransaction(firstTransaction);
  blockchain.addTransaction(validTransfer);

  assert.deepEqual(blockchain.pendingTransactions, [
    firstTransaction,
    validTransfer,
  ]);
});

test('mines pending transactions into a new block', () => {
  const blockchain = new Blockchain();
  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };
  const genesisHash = blockchain.getLatestBlock().hash;

  blockchain.addTransaction(transaction);
  const minedBlock = blockchain.minePendingTransactions(2);

  assert.equal(blockchain.chain.length, 2);
  assert.equal(minedBlock.index, 1);
  assert.equal(minedBlock.previousHash, genesisHash);
  assert.deepEqual(minedBlock.data, [transaction]);
  assert.equal(minedBlock.hash.startsWith('00'), true);
  assert.deepEqual(blockchain.pendingTransactions, []);
});

test('uses mined transaction history when validating future transfers', () => {
  const blockchain = new Blockchain();
  const firstTransaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };
  const validTransfer = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xCollectorA',
    toAddress: '0xCollectorB',
    timestamp: 1772275200000,
  };

  blockchain.addTransaction(firstTransaction);
  blockchain.minePendingTransactions(1);
  blockchain.addTransaction(validTransfer);

  assert.deepEqual(blockchain.pendingTransactions, [validTransfer]);
});

test('validates a correct chain', () => {
  const blockchain = new Blockchain();
  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };

  blockchain.addTransaction(transaction);
  blockchain.minePendingTransactions(1);

  assert.equal(blockchain.isChainValid(), true);
});

test('detects changed data in a mined block', () => {
  const blockchain = new Blockchain();
  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };

  blockchain.addTransaction(transaction);
  blockchain.minePendingTransactions(1);

  blockchain.chain[1].data[0].toAddress = '0xAttacker';

  assert.equal(blockchain.isChainValid(), false);
});

test('detects a broken previousHash link', () => {
  const blockchain = new Blockchain();
  const transaction = {
    serialNumber: 'ROLEX-SUB-9981',
    fromAddress: '0xManufacturerKey',
    toAddress: '0xCollectorA',
    timestamp: 1772188800000,
  };

  blockchain.addTransaction(transaction);
  blockchain.minePendingTransactions(1);

  blockchain.chain[1].previousHash = 'fake-previous-hash';

  assert.equal(blockchain.isChainValid(), false);
});
