import express from 'express';
import {
  createTransaction,
  getChain,
} from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', getChain);
router.post('/transactions', createTransaction);

export default router;
