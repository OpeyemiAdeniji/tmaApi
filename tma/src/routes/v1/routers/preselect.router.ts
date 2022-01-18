import express, { Router } from 'express'

import {
    getPreselects,
    getPreselect
} from '../../../controllers/preselect.controller';

import advanced from '../../../middleware/adanced.mw'
import Preselect from '../../../models/Preselect.model'

const router: Router = express.Router({ mergeParams: true });

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advanced(Preselect), getPreselects);
router.get('/:id', vcd, protect, authorize(allRoles), getPreselect);

export default router;