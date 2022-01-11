import express, { Router } from 'express'

import {
    pushEvent
} from '../../../controllers/notify.controller';

// header middleware
import { validateChannels as vcd } from '../../../middleware/header.mw'

// router definition
const router: Router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw';

// variables
//variables
const roles = ['superadmin', 'admin']; 
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/events', vcd, protect, authorize(allRoles), pushEvent);

export default router;