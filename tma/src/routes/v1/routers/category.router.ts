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
<<<<<<< HEAD
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(allRoles), advancedResults(Category), getCategories);
=======
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(limRoles), advancedResults(Category), getCategories);
>>>>>>> 67ef79561d23c3592f0be610c0f5985e2cbe3aad
router.get('/:id', vcd, protect, authorize(allRoles), getCategory);

export default router;