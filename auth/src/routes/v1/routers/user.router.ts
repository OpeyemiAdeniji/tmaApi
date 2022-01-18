import express, { Router } from 'express'


import {
    getUsers,
    getUser,
    changePassword,
    getUserStatus,
    addManager,
    addBusiness,
    addTalent,
    acceptInvite
} from '../../../controllers/user.controller';

import advanced from '../../../middleware/adanced.mw'
import User from '../../../models/User.model'

const router: Router = express.Router({ mergeParams: true });

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advanced(User), getUsers);
router.get('/:id', vcd, protect, authorize(allRoles), getUser);
router.get('/status/:id', vcd, protect, authorize(allRoles), getUserStatus);
router.post('/add-manager', vcd, protect, authorize(limRoles), addManager);
router.post('/add-talent', vcd, protect, authorize(limRoles), addTalent);
router.post('/add-business', vcd, protect, authorize(limRoles), addBusiness);
router.put('/accept-invite', vcd, acceptInvite);
router.put('/change-password/:id', vcd, protect, authorize(allRoles), changePassword);

export default router;