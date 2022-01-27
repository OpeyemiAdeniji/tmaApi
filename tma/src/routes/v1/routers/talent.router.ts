import express, { Router } from 'express'

import {
    getTalents,
    getAllTalents,
    getTalent,
    apply,
    uploadTalent,
    selectTalent,
    viewSelectedTalents
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
router.get('/get-talents', vcd, protect, authorize(limRoles), getAllTalents);
router.get('/:id', vcd, protect, authorize(allRoles), getTalent);
router.put('/apply/:id', vcd, protect, authorize(allRoles), apply);
router.put('/upload/:id', vcd, protect, authorize(limRoles), uploadTalent);
router.put('/preselect/:id', vcd, protect, authorize(limRoles), selectTalent);
router.put('/preview', vcd, protect, authorize(limRoles), viewSelectedTalents);

export default router;