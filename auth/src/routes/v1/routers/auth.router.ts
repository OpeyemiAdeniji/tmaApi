import express, { Router, Request, Response, NextFunction } from 'express';

import {
    
    registerTalent,
    registerBusiness,
    login,
    logout,
    getUser,
    updatePassword,
    resetPassword,
    activateAccount,
    sendResetLink,
    attachRole,
    detachRole,
    sendUser

} from '../../../controllers/auth.controller'

import { validateChannels as vcd } from '../../../middleware/header.mw'

const router: Router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin']
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'user'];

router.post('/register', vcd, registerTalent);
router.post('/register/manager', vcd, registerBusiness);
router.post('/login', vcd, login);
router.post('/logout', vcd, logout);
router.get('/user/:id', vcd, protect, authorize(allRoles), getUser);
router.post('/change-password/:id', vcd, protect, authorize(allRoles), updatePassword);
router.post('/forgot-password', vcd, sendResetLink);
router.post('/reset-password/:token', vcd, resetPassword);
router.post('/activate-account/:token', vcd, activateAccount);
router.post('/attach-role/:id', vcd, protect, authorize(roles), attachRole);
router.post('/detach-role/:id', vcd, protect, authorize(roles), detachRole);
router.post('/sms', vcd, sendUser);

export default router;
