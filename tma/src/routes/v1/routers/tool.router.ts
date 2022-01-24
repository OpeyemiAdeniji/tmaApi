import express, { Router } from 'express';

import {
    getTools,
    getTool
} from '../../../controllers/tool.controller';

import Tool from '../../../models/Tool.model';

import advancedResults from '../../../middleware/adanced.mw';
const router: Router = express.Router({ mergeParams: true });
import { validateChannels as vcd } from '../../../middleware/header.mw';
import { protect, authorize } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
<<<<<<< HEAD
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(allRoles), advancedResults(Tool), getTools);
=======
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, advancedResults(Tool), getTools);
>>>>>>> 67ef79561d23c3592f0be610c0f5985e2cbe3aad
router.get('/:id', vcd, protect, authorize(allRoles), getTool);

export default router;