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

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, advancedResults(Language), getLanguages);
router.get('/:id', vcd, protect, authorize(roles), getLanguage);
router.post('/add-language', vcd, protect, authorize(roles), addLanguage);
router.put('/:id', vcd, protect, authorize(roles), updateLanguage);

export default router;