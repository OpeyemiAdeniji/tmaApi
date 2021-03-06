import express, { Router } from 'express'


import {
    getBusinesses,
    getBusinessFavourites,
    hireTalents,
    getThirdParties,
    getBusiness,
    getThirdParty,
    addFavourite
} from '../../../controllers/business.controller';


const router: Router = express.Router({ mergeParams: true });

import Business from '../../../models/Business.model'

import advancedResults from '../../../middleware/adanced.mw';

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Business), getBusinesses);
router.get('/get-favorites/:id', vcd, protect, authorize(bizRoles), getBusinessFavourites);
router.post('/:id', vcd, protect, authorize(bizRoles), hireTalents);
router.get('/third-parties', vcd, protect, authorize(roles), getThirdParties);
router.get('/:id', vcd, protect, authorize(bizRoles), getBusiness);
router.get('/third-party/:id', vcd, protect, authorize(bizRoles), getThirdParty);
router.post('/add-favorite/:id', vcd, protect, authorize(bizRoles), addFavourite);

export default router;