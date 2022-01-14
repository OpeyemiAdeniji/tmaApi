import express, { Router } from 'express';

import { 
    getIndustries,
    getIndustry
 } from '../../../controllers/industry.controller';

 import advancedResults from '../../../middleware/adanced.mw';
 import Industry from '../../../models/Cloud.model';

 const router: Router = express.Router({ mergeParams: true});

 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

 router.get('/', vcd, advancedResults(Industry), getIndustries);
 router.get('/:id', vcd, getIndustry);

export default router;