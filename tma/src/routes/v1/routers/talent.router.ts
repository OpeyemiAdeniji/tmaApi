import express, { Router } from 'express'


import {
    getTalents,
    getTalent,
    apply
} from '../../../controllers/talent.controller';


const router: Router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), getTalents);
router.get('/:id', vcd, protect, authorize(roles), getTalent);
router.get('/', vcd, protect, authorize(allRoles), apply);

export default router;