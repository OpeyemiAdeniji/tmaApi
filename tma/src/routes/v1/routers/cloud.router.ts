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

 const roles = ['superadmin', 'admin'];
 const limRoles = ['superadmin', 'admin', 'manager'];
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

<<<<<<< HEAD
router.get('/', vcd, protect, authorize(allRoles), advancedResults(Cloud), getClouds);
=======
router.get('/', vcd, protect, authorize(limRoles), advancedResults(Cloud), getClouds);
>>>>>>> 67ef79561d23c3592f0be610c0f5985e2cbe3aad
router.get('/:id', vcd, protect, authorize(allRoles), getCloud);
router.post('/', vcd, protect, authorize(roles), addCloud);
router.put('/:id', vcd, protect, authorize(roles), updateCloud);

 export default router;
