import express, {Router} from 'express';

import {
    getEducations,
    getEducation,
    getTalentEducationList,
    addEducation
} from '../../../controllers/education.controller';

import Education from '../../../models/Education.model';

const router: Router = express.Router({ mergeParams: true });
import advancedResults from '../../../middleware/adanced.mw';
import { validateChannels as vcd } from '../../../middleware/header.mw';
import { authorize, protect } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Education), getEducations);
router.get('/:id', vcd, protect, authorize(allRoles), getEducation);
router.get('/:id', vcd, protect, authorize(limRoles), getTalentEducationList);
router.post('/add-education/:id', vcd, protect, authorize(allRoles), addEducation);

export default router;