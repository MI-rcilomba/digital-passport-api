import test from 'node:test';
import assert from 'node:assert/strict';
import Block from '../src/engine/Block.js';

test('creates a SHA-256 hash when a block is created', () => {
  const block = new Block(
    1,
    1772188800000,
    [
      {
        serialNumber: 'ROLEX-SUB-9981',
        fromAddress: '0xManufacturerKey',
        toAddress: '0xCollectorA',
        timestamp: 1772188800000,
      },
    ],
    'previous-hash',
  );

  assert.equal(typeof block.hash, 'string');
  assert.equal(block.hash.length, 64);
});

test('changes the hash when the nonce changes', () => {
  const block = new Block(1, 1772188800000, [], 'previous-hash');

  const originalHash = block.hash;

  block.nonce = 1;
  const newHash = block.calculateHash();

  assert.notEqual(newHash, originalHash);
});

test('mines a block with the required difficulty prefix', () => {
  const block = new Block(1, 1772188800000, [], 'previous-hash');

  block.mineBlock(2);

  assert.equal(block.hash.startsWith('00'), true);
});

test('updates the nonce while mining', () => {
  const block = new Block(1, 1772188800000, [], 'previous-hash');

  block.mineBlock(2);

  assert.equal(block.nonce > 0, true);
});

test('creates the same hash for data with the same values in different key order', () => {
  const firstBlock = new Block(
    1,
    1772188800000,
    [
      {
        serialNumber: 'ROLEX-SUB-9981',
        fromAddress: '0xManufacturerKey',
        toAddress: '0xCollectorA',
        timestamp: 1772188800000,
      },
    ],
    'previous-hash',
  );

  const secondBlock = new Block(
    1,
    1772188800000,
    [
      {
        timestamp: 1772188800000,
        toAddress: '0xCollectorA',
        fromAddress: '0xManufacturerKey',
        serialNumber: 'ROLEX-SUB-9981',
      },
    ],
    'previous-hash',
  );

  assert.equal(firstBlock.hash, secondBlock.hash);
});
