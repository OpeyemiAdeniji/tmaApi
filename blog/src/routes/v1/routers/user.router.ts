import express, { Router } from 'express'


import {
    getUsers,
    getUser
} from '../../../controllers/user.controller';


const router: Router = express.Router({ mergeParams: true });

import User from '../../../models/User.model'

import advancedResults from '../../../middleware/adanced.mw';

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(User), getUsers);
router.get('/:id', vcd, protect, authorize(roles), getUser);

export default router;