import express, { Router } from 'express';

import {
    getSkills,
    getSkill
} from '../../../controllers/skill.controller';

import Skill from '../../../models/Skill.model';

import advancedResults from '../../../middleware/adanced.mw';
const router: Router = express.Router({ mergeParams: true });
import { validateChannels as vcd } from '../../../middleware/header.mw';
import { protect, authorize } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
 const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(allRoles), advancedResults(Skill), getSkills);
router.get('/:id', vcd, protect, authorize(allRoles), getSkill);

export default router;