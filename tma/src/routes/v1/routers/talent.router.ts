import express, { Router } from 'express'

import {
    getTalents,
    getTalent,
    apply
} from '../../../controllers/talent.controller';

import Talent from '../../../models/Category.model'
import advancedResults from '../../../middleware/adanced.mw'
const router: Router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';


const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Talent), getTalents);
router.get('/:id', vcd, protect, authorize(allRoles), getTalent);
router.put('/apply/:id', vcd, protect, authorize(allRoles), apply);

export default router;