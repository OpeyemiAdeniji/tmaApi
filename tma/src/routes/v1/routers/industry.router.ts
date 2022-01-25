import express, { Router } from 'express';

import { 
    getIndustries,
    getIndustry,
    addIndustry,
    updateIndustry
 } from '../../../controllers/industry.controller';

 import advancedResults from '../../../middleware/adanced.mw';
 import Industry from '../../../models/Industry.model';

 const router: Router = express.Router({ mergeParams: true});
 import { authorize, protect } from '../../../middleware/auth.mw';
 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
 const limRoles = ['superadmin', 'admin', 'manager'];
 const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

 router.get('/', vcd, protect, authorize(allRoles), advancedResults(Industry), getIndustries);
 router.get('/:id', vcd, protect, authorize(limRoles), getIndustry);
 router.post('/', vcd, protect, authorize(roles), addIndustry);
 router.put('/:id', vcd, protect, authorize(roles), updateIndustry);

export default router;