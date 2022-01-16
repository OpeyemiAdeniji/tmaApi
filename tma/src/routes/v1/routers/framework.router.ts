import express, { Router } from 'express';

import { 
    getFrameworks,
    getFramework
 } from '../../../controllers/framework.controller';

 import advancedResults from '../../../middleware/adanced.mw';
 import Framework from '../../../models/Framework.model';

 const router: Router = express.Router({ mergeParams: true});

 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

 router.get('/', vcd, advancedResults(Framework), getFrameworks);
 router.get('/:id', vcd, getFramework);

export default router;