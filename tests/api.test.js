import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

function startTestServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://localhost:${port}`,
      });
    });
  });
}

test('GET /api/chain returns the blockchain', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/chain`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body.chain), true);
    assert.equal(Array.isArray(body.pendingTransactions), true);
  } finally {
    server.close();
  }
});

test('POST /api/transactions adds a transaction', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber: 'API-TEST-001',
        fromAddress: '0xManufacturerKey',
        toAddress: '0xCollectorA',
        timestamp: 1772188800000,
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.transaction.serialNumber, 'API-TEST-001');
  } finally {
    server.close();
  }
});

test('POST /api/transactions returns 422 for invalid transaction', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber: 'API-TEST-INVALID-001',
        fromAddress: '0xFakeSeller',
        toAddress: '0xCollectorA',
        timestamp: 1772188800000,
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.message, 'Invalid transaction');
  } finally {
    server.close();
  }
});

test('POST /api/mine mines pending transactions', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber: 'API-MINE-001',
        fromAddress: '0xManufacturerKey',
        toAddress: '0xCollectorA',
        timestamp: 1772188800000,
      }),
    });

    const response = await fetch(`${baseUrl}/api/mine`, {
      method: 'POST',
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(
      body.block.data.some(
        (transaction) => transaction.serialNumber === 'API-MINE-001',
      ),
      true,
    );
    assert.equal(body.block.hash.startsWith('0'), true);
    assert.equal(body.chainLength >= 2, true);
  } finally {
    server.close();
  }
});

test('GET /api/verify/:id returns product history and current owner', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber: 'API-VERIFY-001',
        fromAddress: '0xManufacturerKey',
        toAddress: '0xCollectorA',
        timestamp: 1772188800000,
      }),
    });

    const response = await fetch(`${baseUrl}/api/verify/API-VERIFY-001`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.serialNumber, 'API-VERIFY-001');
    assert.equal(body.currentOwner, '0xCollectorA');
    assert.equal(body.history.length, 1);
  } finally {
    server.close();
  }
});
