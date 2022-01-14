import express, { Router } from 'express'


import {
    getInterviews,
    getInterview
} from '../../../controllers/interview.controller';

import advanced from '../../../middleware/adanced.mw'
import Interview from '../../../models/Interview.model'

const router: Router = express.Router({ mergeParams: true });

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/get-talents', vcd, protect, authorize(allRoles), getInterviews);
router.get('/get-businesses', vcd, protect, authorize(allRoles), getInterview);

export default router;