import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
import { userLogger } from '../config/wiston';

// models
import Skill from '../models/Skill.model';

// @desc           Get all Skills
// @route          GET /api/tma/v1/skills
// @access         Private
export const getSkills = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

// @desc           Get all Skills
// @route          GET /api/tma/v1/skills
// @access         Private/Superadmin/Admin
export const getSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const skill = await Skill.findById(req.params.id).populate([ { path: 'user'} ])

    if (!skill) {
        return next(new ErrorResponse('Error', 404, ['skill does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: skill,
        message: 'successful',
        status: 200
    });
});
