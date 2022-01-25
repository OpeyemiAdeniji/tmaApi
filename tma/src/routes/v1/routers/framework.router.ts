import express, { Router } from 'express';

import { 
    getFrameworks,
    getFramework,
    addFramework,
    updateFramework
 } from '../../../controllers/framework.controller';

 import advancedResults from '../../../middleware/adanced.mw';
 import Framework from '../../../models/Framework.model';

 const router: Router = express.Router({ mergeParams: true});
 import { authorize, protect } from '../../../middleware/auth.mw';
 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
 const limRoles = ['superadmin', 'admin', 'manager'];
 const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
 const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

 router.get('/', vcd, protect, authorize(allRoles), advancedResults(Framework), getFrameworks);
 router.get('/:id', vcd, protect, authorize(allRoles), getFramework);
 router.post('/', vcd, protect, authorize(roles), addFramework);
 router.put('/:id', vcd, protect, authorize(roles), updateFramework);

export default router;