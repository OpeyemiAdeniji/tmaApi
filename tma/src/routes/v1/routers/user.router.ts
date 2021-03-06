import express, { Router } from 'express'

import {
    getTalents,
    getBusinesses,
    getSystemResources
} from '../../../controllers/user.controller';

import advanced from '../../../middleware/adanced.mw'
import User from '../../../models/User.model'

const router: Router = express.Router({ mergeParams: true });

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/system-resources', vcd, protect, authorize(allRoles), getSystemResources);
router.get('/talents', vcd, protect, authorize(limRoles), getTalents);
router.get('/businesses', vcd, protect, authorize(limRoles), getBusinesses);

export default router;