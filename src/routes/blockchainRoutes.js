import express from 'express';
import {
  createTransaction,
  getChain,
  minePendingTransactions,
  verifyProduct,
} from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', getChain);
router.post('/transactions', createTransaction);
router.post('/mine', minePendingTransactions);
router.get('/verify/:id', verifyProduct);

export default router;
