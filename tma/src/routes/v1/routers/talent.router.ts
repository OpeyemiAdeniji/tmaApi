import express, { Router } from 'express'

import {
    getTalents,
    getTalent,
    apply,
    uploadTalent
} from '../../../controllers/talent.controller';

import Talent from '../../../models/Talent.model'
import advancedResults from '../../../middleware/adanced.mw'
const router: Router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';


const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
 const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(limRoles), advancedResults(Talent), getTalents);
router.get('/:id', vcd, protect, authorize(allRoles), getTalent);
router.put('/apply/:id', vcd, protect, authorize(allRoles), apply);
router.put('/upload/:id', vcd, protect, authorize(allRoles), uploadTalent);

export default router;