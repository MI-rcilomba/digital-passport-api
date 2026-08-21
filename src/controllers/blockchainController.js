import blockchain from '../services/blockchainService.js';

export function getChain(req, res) {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions,
  });
}

export function createTransaction(req, res) {
  const transaction = req.body;

  blockchain.addTransaction(transaction);

  res.status(201).json({
    message: 'Transaction added to pending transactions',
    transaction,
    pendingTransactions: blockchain.pendingTransactions,
  });
}
