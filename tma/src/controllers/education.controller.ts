import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmat'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { uploadBase64File } from '../utils/google.util'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// import models
import Education from '../models/Education.model';
import User from '../models/User.model';

// @desc           Get Educations
// @route          GET /api/tma/v1/educations
// @access         Private
export const getEducations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

// @desc           Get an Education
// @route          GET /api/tma/v1/education/.:id
// @access         Private/Superadmin/admin
export const getEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const education = await Education.findById(req.params.id);

    if (!education) {
        return next(new ErrorResponse('Error', 404, ['Education not found']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: education,
        message: 'successful',
        status: 200
    })
});