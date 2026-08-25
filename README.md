# Digital Passport API

A Node.js REST API that uses a simplified Proof-of-Work blockchain to track and verify ownership of luxury products.

## Scenario

This project uses the luxury product scenario. Each product has a digital passport identified by a `serialNumber`. The blockchain stores ownership transfers so the product history can be verified later.

Example transaction:

```json
{
  "serialNumber": "ROLEX-SUB-9981",
  "fromAddress": "0xManufacturerKey",
  "toAddress": "0xCollectorA",
  "timestamp": 1772188800000
}
```

## Features

- Express REST API
- Simplified blockchain ledger
- Genesis block
- Pending transactions
- SHA-256 hashing with Node.js `crypto`
- Proof of Work mining with nonce
- Configurable mining difficulty via `POW_DIFFICULTY`
- Ownership state validation
- Chain validation
- Deterministic JSON serialization before hashing
- Central Express error middleware
- Automated tests with Node.js test runner

## Tech Stack

- Node.js
- Express
- ES modules
- Node.js built-in `crypto`
- Node.js built-in test runner

## Project Structure

```text
src/
|-- controllers/
|-- engine/
|-- middleware/
|-- routes/
|-- services/
|-- utils/
|-- app.js
`-- server.js

tests/
```

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

You can also set Proof-of-Work difficulty:

```bash
POW_DIFFICULTY=2 npm run dev
```

In PowerShell:

```powershell
$env:POW_DIFFICULTY=2
npm run dev
```

## API Endpoints

### GET /api/chain

Returns the full blockchain and pending transactions.

```bash
curl http://localhost:3000/api/chain
```

### POST /api/transactions

Adds a valid transaction to pending transactions.

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"serialNumber":"ROLEX-SUB-9981","fromAddress":"0xManufacturerKey","toAddress":"0xCollectorA","timestamp":1772188800000}'
```

Invalid ownership transfers are rejected with status `422`.

### POST /api/mine

Mines pending transactions into a new block.

```bash
curl -X POST http://localhost:3000/api/mine
```

### GET /api/verify/:id

Returns product history and current owner.

```bash
curl http://localhost:3000/api/verify/ROLEX-SUB-9981
```

## State Validation

A product can only be transferred by its current owner.

If a product does not exist yet, the first transaction must come from:

```text
0xManufacturerKey
```

After that, `fromAddress` must match the current owner from the product history.

## Proof of Work

Each block has a `nonce`. During mining, the nonce is increased until the block hash starts with the required number of leading zeroes.

Example:

```text
POW_DIFFICULTY=2
```

means the hash must start with:

```text
00
```

## Testing

Run all tests:

```bash
npm test
```

The tests cover:

- block hashing
- Proof of Work
- blockchain validation
- state validation
- API routes
- error handling
