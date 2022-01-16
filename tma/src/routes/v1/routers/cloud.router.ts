import express, { Router } from 'express';

import { 
    getClouds,
    getCloud
 } from '../../../controllers/cloud.controller';

 import advancedResults from '../../../middleware/adanced.mw';
 import Cloud from '../../../models/Cloud.model';

 const router: Router = express.Router({ mergeParams: true});

 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

 router.get('/', vcd, advancedResults(Cloud), getClouds);
 router.get('/:id', vcd, getCloud);

export default router;