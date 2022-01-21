import express, { Router } from 'express'


import {
    getPosts,
    getPost
} from '../../../controllers/post.controller';


const router: Router = express.Router({ mergeParams: true });

import Post from '../../../models/Post.model'

import advancedResults from '../../../middleware/adanced.mw';

import { protect, authorize } from '../../../middleware/auth.mw'
import { validateChannels as vcd } from '../../../middleware/header.mw';

const roles = ['superadmin', 'admin'];
const limRoles = ['superadmin', 'admin', 'manager'];
const bizRoles = ['superadmin', 'admin', 'manager', 'business'];
const allRoles = ['superadmin', 'admin', 'business', 'manager', 'talent', 'user'];

router.get('/', vcd, protect, authorize(roles), advancedResults(Post), getPosts);
router.get('/:id', vcd, protect, authorize(roles), getPost);

export default router;