import express, {Router} from 'express';

import {
    getEducations,
    getEducation
} from '../../../controllers/education.controller';

import Education from '../../../models/Education.model';

import advancedResults from '../../../middleware/adanced.mw';
const router: Router = express.Router({ mergeParams: true });
import { validateChannels as vcd } from '../../../middleware/header.mw';
import { authorize, protect } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Education), getEducations);
router.get('/:id', vcd, protect, authorize(allRoles), getEducation);

export default router;