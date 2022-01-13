import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmat'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';

// models
import Skill from '../models/Skill.model';

//  @desc   Get all skills
//  @route  GET /api/tma/v1/skills
//  @access Private superadmin/admin
export const getAllSkills = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

//  @desc   Get a skills
//  @route  GET /api/tma/v1/skills/:id
//  @access Private superadmin/admin
export const getSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        return next(new ErrorResponse('Error', 404, ['cannot find skill']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: skill,
        message: 'successful',
        status: 200
    });
});

//  @desc   Get all skills
//  @route  GET /api/tma/v1/skills
//  @access Private superadmin/admin


