import express, { Router } from 'express';

import {
    getAllSkills,
    getSkill
} from '../../../controllers/skill.controller';

import Skill from '../../../models/Skill.model';

import advancedResults from '../../../middleware/adanced.mw';
const router: Router = express.Router({ mergeParams: true });
import { validateChannels as vcd } from '../../../middleware/header.mw';
import { protect, authorize } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, advancedResults(Skill), getAllSkills);
router.get('/:id', vcd, getSkill);

export default router;