import express, { Router } from 'express';

import { 
    getWorks,
    getWork
 } from '../../../controllers/work.controller';

 import advancedResults from '../../../middleware/adanced.mw';
 import Work from '../../../models/Work.model';

 const router: Router = express.Router({ mergeParams: true});

 import { validateChannels as vcd } from '../../../middleware/header.mw';

 const roles = ['superadmin', 'admin', 'user'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

 router.get('/', vcd, advancedResults(Work), getWorks);
 router.get('/:id', vcd, getWork);

export default router;