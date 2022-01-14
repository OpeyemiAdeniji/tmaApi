import express, { Router } from 'express'


import {
    getTalents,
    getBusinesses,
    getOrganizations
} from '../../../controllers/user.controller';

import advanced from '../../../middleware/adanced.mw'
import User from '../../../models/User.model'

const router: Router = express.Router({ mergeParams: true });

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/get-talents', vcd, protect, authorize(allRoles), getTalents);
router.get('/get-businesses', vcd, protect, authorize(allRoles), getBusinesses);
router.get('/get-organizations', vcd, protect, authorize(allRoles), getOrganizations);

export default router;