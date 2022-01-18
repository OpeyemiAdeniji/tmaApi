import express, {Router} from 'express';

import {
    getLanguages,
    getLanguage,
    addLanguage,
    updateLanguage
} from '../../../controllers/language.controller';

import Language from '../../../models/Language.model';

import advancedResults from '../../../middleware/adanced.mw';

const router: Router = express.Router({ mergeParams: true });
import { authorize, protect } from '../../../middleware/auth.mw';
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin', 'user'];
const limRoles = ['superadmin', 'admin', 'manager'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Language), getLanguages);
router.get('/:id', vcd, protect, authorize(allRoles), getLanguage);
router.post('/', vcd, protect, authorize(roles), addLanguage);
router.put('/:id', vcd, protect, authorize(roles), updateLanguage);

export default router;