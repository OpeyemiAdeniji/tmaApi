import express, { Router } from 'express';

import { 
    getClouds,
    getCloud,
    addCloud,
    updateCloud
 } from '../../../controllers/cloud.controller';

 import advancedResults from '../../../middleware/adanced.mw';
 import Cloud from '../../../models/Cloud.model';

 const router: Router = express.Router({ mergeParams: true});

 import { protect, authorize } from '../../../middleware/auth.mw'
 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

 router.get('/', vcd, advancedResults(Cloud), getClouds);
 router.get('/:id', vcd, protect, authorize(roles), getCloud);
 router.post('/add-cloud', vcd, protect, authorize(roles), addCloud);
 router.put('/:id', vcd, protect, authorize(roles), updateCloud);

export default router;