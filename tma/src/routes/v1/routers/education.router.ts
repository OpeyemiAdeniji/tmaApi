import express, {Router} from 'express';

import {
    getEducations,
    getEducation,
    createEducation
} from '../../../controllers/education.controller';

import Education from '../../../models/Education.model';

import advancedResults from '../../../middleware/adanced.mw';
const router: Router = express.Router({ mergeParams: true });
import { validateChannels as vcd } from '../../../middleware/header.mw';
import { authorize, protect } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, advancedResults(Education), getEducations);
router.get('/:id', vcd, getEducation);
router.post('/', vcd, protect, authorize(allRoles), createEducation);

export default router;