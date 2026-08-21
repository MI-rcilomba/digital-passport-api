import express from 'express';
import { getChain } from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', getChain);

export default router;
