import express, { Router } from 'express';

import {
    getCategories,
    getCategory
} from '../../../controllers/category.controller';

import Category from '../../../models/Category.model';

import advancedResults from '../../../middleware/adanced.mw';
const router: Router = express.Router({ mergeParams: true });
import { validateChannels as vcd } from '../../../middleware/header.mw';
import { protect, authorize } from '../../../middleware/auth.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Category), getCategories);
router.get('/:id', vcd, protect, authorize(allRoles), getCategory);

export default router;