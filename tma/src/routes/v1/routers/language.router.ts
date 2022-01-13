import express, {Router} from 'express';

import {
    getLanguages,
    getLanguage
} from '../../../controllers/language.controller';

import Language from '../../../models/Language.model';

import advancedResults from '../../../middleware/adanced.mw';
const router: Router = express.Router({ mergeParams: true });
import { validateChannels as vcd } from '../../../middleware/header.mw';

router.get('/', vcd, advancedResults(Language), getLanguages);
router.get('/:id', vcd, getLanguage);

export default router;