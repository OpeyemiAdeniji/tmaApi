import express from 'express';

import {
    getBank,
    getBanks,
    createBank
} from '../../../controllers/bank.controller';

import advancedResults from '../../../middleware/advanced.mw';

const router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw';
import { validateChannels as vcd } from '../../../middleware/header.mw'
import Bank from '../../../models/Bank.model'

router.get('/', vcd, advancedResults(Bank), getBanks);
router.get('/:id', vcd, getBank);
router.post('/', vcd, protect, authorize(['superadmin']), createBank)

export default router;