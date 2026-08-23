import blockchain from '../services/blockchainService.js';

export function getChain(req, res) {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions,
  });
}

export function createTransaction(req, res, next) {
  try {
    const transaction = req.body;

    blockchain.addTransaction(transaction);

    return res.status(201).json({
      message: 'Transaction added to pending transactions',
      transaction,
      pendingTransactions: blockchain.pendingTransactions,
    });
  } catch (error) {
    return next(error);
  }
}

export function minePendingTransactions(req, res) {
  const difficulty = Number(process.env.POW_DIFFICULTY || 1);
  const minedBlock = blockchain.minePendingTransactions(difficulty);

  res.status(201).json({
    message: 'Block mined successfully',
    difficulty,
    block: minedBlock,
    chainLength: blockchain.chain.length,
  });
}

export function verifyProduct(req, res) {
  const { id } = req.params;
  const history = blockchain.getProductHistory(id);
  const currentOwner = blockchain.getCurrentOwner(id);

  if (history.length === 0) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  return res.status(200).json({
    serialNumber: id,
    currentOwner,
    history,
  });
}
