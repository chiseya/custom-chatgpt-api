import express from 'express';
import { handleGetVerify } from '@/controllers/verify/handleGetVerify';

const router = express.Router();
router.get('/', handleGetVerify);

export default router;
