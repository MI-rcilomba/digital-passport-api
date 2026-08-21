import express from 'express';
import {
  createTransaction,
  getChain,
  minePendingTransactions,
} from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', getChain);
router.post('/transactions', createTransaction);
router.post('/mine', minePendingTransactions);

export default router;
