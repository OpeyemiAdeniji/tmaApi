import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { uploadBase64File } from '../utils/google.util'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// import models
import Education from '../models/Education.model';
import User from '../models/User.model';
import Talent from '../models/Talent.model';

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
        return next(new ErrorResponse('Error', 404, ['Education does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: education,
        message: 'successful',
        status: 200
    })
});

// @desc           Get a Talent Education List
// @route          GET /api/tma/v1/education/talent/:id
// @access         Private/Superadmin/admin/talent
export const getTalentEducationList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const talent = await Talent.findOne({ user: req.params.id });

    if (!talent) {
        return next(new ErrorResponse('Error', 404, ['user does not exist']))
    }

    const educations = await Education.find({ user: talent.user });

    res.status(200).json({
        error: false,
        errors: [],
        data: educations.length > 0 ? educations : [],
        message: 'successful',
        status: 200
    })


});

// @desc           Add education
// @route          GET /api/tma/v1/education/talent/add-education/:id
// @access         Private/Superadmin/admin/talent
export const addEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const {
        institutionName,
        degree,
        startDate,
        endDate,
        isCurrent,
    } = req.body

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('Error', 404, ['user does not exist']))
    }

    const talent = await Talent.findOne({ user: req.params.id });

    if (user && !talent) {
        return next(new ErrorResponse('Error', 404, ['talent profile does not exist']))
    }

    if(!startDate){
        return next(new ErrorResponse('Error', 404, ['start date is required']))
    }

    const sd = await dayjs(startDate);
    const ed = await dayjs(endDate);

    const edu = await Education.create({
        institutionName,
        degree,
        startDate: sd,
        endDate: ed,
        isCurrent,
        user: user._id
    });

    res.status(200).json({
        error: false,
        errors: [],
        data: edu,
        message: 'successful',
        status: 200
    })

    
});
