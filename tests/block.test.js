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
