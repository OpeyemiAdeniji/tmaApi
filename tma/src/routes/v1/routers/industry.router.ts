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

 import { protect, authorize } from '../../../middleware/auth.mw'
 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, advancedResults(Industry), getIndustries);
router.get('/:id', vcd, protect, authorize(roles), getIndustry);
router.post('/add-industry', vcd, protect, authorize(roles), addIndustry);
router.put('/:id', vcd, protect, authorize(roles), updateIndustry);

export default router;