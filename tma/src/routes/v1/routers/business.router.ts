import express, { Router } from 'express'


import {
    getBusinesses,
    getBusiness,
    getOrganization
} from '../../../controllers/business.controller';


const router: Router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), getBusinesses);
router.get('/get-business/:id', vcd, protect, authorize(roles), getBusiness);
router.get('/get-organization/:id', vcd, protect, authorize(roles), getOrganization);

export default router;