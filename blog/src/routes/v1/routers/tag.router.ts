import express, { Router } from 'express'


import {
    getTags,
    getTag
} from '../../../controllers/tag.controller';


const router: Router = express.Router({ mergeParams: true });

import Tag from '../../../models/Tag.model'

import advancedResults from '../../../middleware/adanced.mw';

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Tag), getTags);
router.get('/:id', vcd, protect, authorize(roles), getTag);

export default router;